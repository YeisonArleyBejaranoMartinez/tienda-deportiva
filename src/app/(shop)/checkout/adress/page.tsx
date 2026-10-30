import { Title } from "@/src/components";
import { AddressForm } from "./AddressForm";
import { getCountries, getUserAddress } from "@/src/actions";
import { auth } from "@/src/auth.config";


export default async function Adress() {
 const countries = await  getCountries();
 const session = await auth();
 if(!session){
  return(
    <h3 className="text-5xl"> 500 - no hay sesiom de ususario </h3>
  )
 }
 const userAddress =  await getUserAddress(session!.user.id) ?? undefined;
//  console.log(userAddress);
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-250 flex flex-col justify-center text-left">
        <Title title="Dirección" subTitle="Dirección de entrega" />
        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
}
