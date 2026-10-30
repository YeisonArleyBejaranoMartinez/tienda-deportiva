import {  Title } from "@/src/components";
// import { initialData } from "../seed/seed";
import Image from "next/image";
import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";
import { getOrderById } from "@/src/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { currencyFormat } from '../../../utils/currencyFormat';
import { PaypalButton } from "@/src/components/paypal/PaypalButton";

interface Props {
  params: {
    id: string;
  };
}
export default async function OrderID({ params }: Props) {
  const { id } = await params;
  const {order, ok}= await getOrderById(id)
  if (!id) return;
  {
    /*TODO:verificar llamar al server actios */
    if(!ok){
      redirect("/")
    }

  }
  const address = order!.OrderAddress;
  // redirect(/)
  return (
    <div className="flex justify-center items-center mb-72 pz-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title={`Orden ${id}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/*carrito */}
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": !order!.isPaid,
                  "bg-green-500": order!.isPaid,
                },
              )}
            >
              <IoCardOutline className="text-3xl mr-2" size={30} />
              {/* <span>Orden Pendiente</span> */}
              <span>{order?.isPaid ? "Order pagada" : "Orden no pagada"}</span>
            </div>
            {/*Itemss*/}
            {order?.OrderItem.map((item) => (
              <div
                key={item.product.slug + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                />
                <div className="">
                  <p className="text-xl">{item.product.title}</p>
                  <p className="text-xl">${item.price}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>
                    <strong>Subtotal </strong>
                    {currencyFormat(item.price * item.quantity)}
                  </p>
                  {/* <QuantitySelector quantity={3} /> */}
                </div>
              </div>
            ))}
          </div>

          {/*checkout  resumen de la compra*/}
          <div className=" bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl bm-2">Direccion de entrega</h2>
            <div className="mb-10">
              <p>
                <strong>Nombre:</strong> {address!.firstName}{" "}
                {address!.lastName}
              </p>
              <p>
                <strong>Telefono:</strong> {address!.phone}
              </p>
              <p>
                <strong>Direccion:</strong> {address!.address}
              </p>
              <p>
                <strong>Ciudad:</strong> {address!.city} {address!.countryId}
              </p>
              <p>
                <strong>Codigo postal:</strong> {address!.postalCode}
              </p>
            </div>
            <div className="w-full h-0.5 rpuded bg-gray-200 mb-10" />
            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. de Productos</span>
              <span className="text-right">
                {order?.itemsInOrder ===1 ? "1 producto" : `${order?.itemsInOrder} productos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {" "}
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Impuestos 15%</span>
              <span className="text-right"> {currencyFormat(order!.tax)}</span>

              <span className="text-2xl mt-5">Total</span>
              <span className="text-right text-2xl mt-5">
                {currencyFormat(order!.total)}
              </span>
            </div>
            {!order!.isPaid && (
              <div className="mt-5">
                <PaypalButton orderId={id} amount={order!.total} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
