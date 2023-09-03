import Image from 'next/image'
import { FaDiscord } from 'react-icons/fa'
import Alpaka from '../../public/alpaka.png'
import Signin from '@/components/auth/signin'

export default function Home() {
    return (
        <div className="relative flex h-screen w-full flex-grow flex-col items-center justify-center">
            <FaDiscord className="text-5xl text-zinc-300" />
            <p className="mb-10 mt-1 text-xl text-zinc-300">Discord Store</p>
            <Signin />
            <div className="absolute bottom-0 left-4">
                <Image
                    src={Alpaka}
                    alt="Alpakas Lab Logo"
                    className="h-auto w-24"
                />
            </div>
        </div>
    )
}
