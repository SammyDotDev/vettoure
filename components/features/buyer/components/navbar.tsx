import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  return (
    <nav className="flex px-10 py-5 border-b border-[#eef1ee] lg:max-w-7xl sm:mx-10 w-full justify-between items-center lg:mx-auto">
			<span className="font-mono font-semibold tracking-[0.3em] text-[17px]">
				VETTA
			</span>
			<div className="flex items-center gap-7 font-sans text-sm font-medium text-[#4d5a54]">
				<Link href="#" className="hover:text-foreground transition-colors">
					Browse
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					How it works
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					For owners
				</Link>
				{/*<Link
					href="/auth/"
					className="text-[#0f3d2e] font-semibold hover:opacity-80 transition-opacity"
				>
					Log in
				</Link>*/}
        <div className='w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center'>
          <h1 className='font-bold'>EN</h1>
				</div>
			</div>
		</nav>
  )
}

export default NavBar
