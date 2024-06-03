'use client';

import { useState } from "react";

interface AssociateCarProps {
    inputName?: string;
}

export const AssociateCar: React.FC<AssociateCarProps> = ({
    inputName = 'associateCar'
}) => {
    const [selectedCars, setSelectedCars] = useState<string[] | null>(null);


    return (
        <div className="flex items-center justify-center w-full">
            <input type="text" className="hidden" name={inputName} />
        </div>
    );
};