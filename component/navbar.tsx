import Image from "next/image"
import fin from './fin.png'

const Navbar = ()=>{
    return(
        <div className='flex items-center space-x-2'>
            <Image
                src={fin}
                alt='Picture Luna'
                width={42}
                height={39}
                />
            <div>
                <span className='font-bold'>FINSTABLE</span><br/>
                <span className='text-blue-500'>Training</span>
            </div>
        </div>
    )
}
export default Navbar