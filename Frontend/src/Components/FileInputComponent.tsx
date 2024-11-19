"use client";

import React, { ReactNode } from "react";
import { Input } from "@/Components/ui/input";

export default function FileInputComponent({ field, label, accept }:{field:any,label:string,accept:string}) {
    return (
        <div>
            <label className="text-white">{label}</label>
            <Input
                type="file"
                accept={accept}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file); // Updates the form state
                }}
                className="bg-neutral-700 text-white"
            />
        </div>
    );
}
