"use client";
import React from "react";
import logo from "../assets/logo.svg";
import Image from "next/image";

const AdminNav = () => {
    return (
        <div className="max-w-md md:max-w-[1280px] flex justify-center md:mx-auto bg-white overflow-hidden">
            <section className="p-6 w-full md:w-[500px] flex">
                <Image
                    src={logo}
                    alt="OSLGSC Logo"
                    className="w-[80px] h-[80px] md:w-[92px] md:h-[92px]"
                />
                <h1 className="font-bold w-fit text-[13.5px] leading-[18px] md:text-lg uppercase text-center text-[#343434] my-auto">
                    Ogun State Local Government Service Commission Award
                </h1>
            </section>
        </div>
    );
};

export default AdminNav;
