"use server"
import { auth } from '@/src/auth.config';
import type { Address, Size } from '@/src/interfaces';
import prisma from '@/src/lib/prisma';
interface productsToOrder {
    productId: string;
    slug: string;
    size: Size;
    quantity: number;
}
export const placeOrder = async (productIds: productsToOrder[],  address: Address)=>{
    const session = await  auth();
    const userId = session?.user.id;
    //verificar sesion de usuario
    if(!userId){
        return{
            ok: false,
            message: "No hay una sesion de usuario activa"
        }
    }
    // Obtener la información de los productos
    // NOTA:  recuerden que podemos llevar 2 o mas  productos con el mismo ID

    const slugs = productIds.map((p) => p.slug);
    const products = await prisma.product.findMany({
        where: { slug: { in: slugs } },
    });
    // console.log("Productos encontrados:", products.length);
    // console.log("products", products);
    //calcular los montos // Encabezado
    const itemsInOrder = productIds.reduce((count, p)=> count + p.quantity, 0);
    // console.log(itemsInOrder);
    //los totales de tax, subtotal, total.
    const {subTotal, tax, total } = productIds.reduce((totals, item)=>{
        const productQuantity = item.quantity;
        const product = products.find((p) => p.slug === item.slug);
        if(!product)  throw new Error(`${item.productId} no se pudo encontrar el producto-500`);
        const subTotal = product.price * productQuantity;
        totals.subTotal+= subTotal;
        totals.tax = subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
    },{subTotal: 0, tax: 0, total: 0}

)

//crear la transaccion de base de datos
try{
    const prismaTx = await prisma.$transaction(async (tx) => {
    //1. actualizar el stock de los productos

    const updatedProductsPromises = products.map((product) => {
        // actualizar los valores
        const productQuantity = productIds
        .filter((p) => p.productId === product.id)
        .reduce((acc, item) => item.quantity + acc, 0);
        if (productQuantity === 0) {
        throw new Error(`${product.id} no tiene cantidad definida`);
        }
        return tx.product.update({
        where: { id: product.id },
        data: {
            inStock: {
            decrement: productQuantity,
            },
        },
        });
    });
    const updateProducts = await Promise.all(updatedProductsPromises);
    //verificar  valores negativos en la existencia  = no hay stock
    updateProducts.forEach((product) => {
        if (product.inStock < 0) {
        throw new Error(`${product.slug} no tiene  invemtario suficiente`);
        }
    });
    //2. crear el encabezado de la order
    const order = await tx.order.create({
        data: {
        userId: userId,
        itemsInOrder: itemsInOrder,
        subTotal: subTotal,
        tax: tax,
        total: total,

        OrderItem: {
            createMany: {
            data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                products.find((product) => product.slug === product.slug)
                    ?.price ?? 0,
            })),
            },
        },
        },
    });
    //validar si el price es cero, entonces, lanzar un error.
    //3. crear la direccion de la orden
    const { country, ...restAddress } = address;
    const orderAddress = await tx.orderAddress.create({
        data: {
        ...restAddress,
        countryId: country,
        orderId: order.id,
        },
    });
    return {
        updatedProducts: updateProducts,
        ordern: order,
        orderAddres: orderAddress,
    };
    });
    return{
        ok: true,
        order: prismaTx.ordern,
        prismaTx: prismaTx,
    }

}
catch(error ){
    return{
        ok: false,
        message: error instanceof Error ? error.message : "Error desconocido"
    }
}

}

