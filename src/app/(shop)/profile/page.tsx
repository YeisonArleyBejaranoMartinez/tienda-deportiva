import { auth } from '@/src/auth.config'
import { Title } from '@/src/components'
import { redirect } from 'next/navigation'


export  default async function  ProfilePage () {
    const session = await  auth()
    if(!session?.user){
        redirect("/")
    }
  return (
    <div>
        <Title title ="Perfil"/>
        <pre>
            {JSON.stringify(session, null, 2)}
        </pre>
        <h3 className='text-3xl mb-10'>Role:{session.user.role}</h3>
    </div>
  )
}

