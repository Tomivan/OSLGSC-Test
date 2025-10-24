"use client";
import React from "react";
import logo from "../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
	return (
		<div className="max-w-md md:max-w-[1280px] flex justify-between md:mx-auto bg-white overflow-hidden">
			<section className="p-6 w-full md:w-[80%] flex justify-between mx-auto my-auto items-center">
				<div className="flex">
				<Image
					src={logo}
					alt="OSLGSC Logo"
					className="w-[53px] h-[53px] md:w-[92px] md:h-[92px]"
				/>
				<h1 className="font-bold w-[145px] md:w-[283px] text-[11px] md:leading-[18px] md:text-base uppercase md:ml-[5px] text-[#343434] my-auto">
					Ogun State Local Government Service
				</h1>
				</div>
				<Link 
				href="/admin/login" 
				className="text-[#3B8501] hover:text-[#2d6801] text-sm font-medium my-auto"
				>
				<button className="bg-[#3B8501] text-white w-[75px] h-[31px] md:w-[149px] md:h-[46px] text-[9px] md:text-[14px] rounded-[5px] ">Admin Login</button>
			</Link>
			</section>
			
		</div>
	);
};

export default Navbar;
