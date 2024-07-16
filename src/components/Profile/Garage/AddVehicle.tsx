'use client';

import { IonIcon } from "@ionic/react";
import { closeCircle, cloudUploadOutline } from "ionicons/icons";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from "clsx";
import { addVehicleToGarage } from "@/actions/garage-actions";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";

// import Pickadate from 'pickadate/builds/react-dom';

import { DatePicker, NextUIProvider } from "@nextui-org/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

// Zod schema for validation
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const REGISTRATION_FORMAT = /^[a-zA-Z0-9\-_]{1,20}$/;

const vehicleFormSchema = z.object({
    cover_photo: z.any()
        .refine((files) => files?.length == 1, "Image is required.")
        // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
    make: z.string().min(1, 'Please select a make'),
    model: z.string().min(1, 'Model is required'),
    variant: z.string().min(1, 'Variant is required'),
    registration: z.string().min(1, 'Registration number is required').regex(REGISTRATION_FORMAT, 'Registration number is invalid'),
    colour: z.string().optional(),
    ownedFrom: z.any(),
    ownedTo: z.any(),
    allow_tagging: z.boolean().optional(),
});

export type GarageFormType = z.infer<typeof vehicleFormSchema>;

const vehicleMakes = {
    acura: 'Acura',
    alfa_romeo: 'Alfa Romeo',
    aston_martin: 'Aston Martin',
    audi: 'Audi',
    bentley: 'Bentley',
    bmw: 'BMW',
    bugatti: 'Bugatti',
    buick: 'Buick',
    cadillac: 'Cadillac',
    chevrolet: 'Chevrolet',
    chrysler: 'Chrysler',
    citroen: 'Citroën',
    dodge: 'Dodge',
    ferrari: 'Ferrari',
    fiat: 'Fiat',
    ford: 'Ford',
    gmc: 'GMC',
    honda: 'Honda',
    hyundai: 'Hyundai',
    infiniti: 'Infiniti',
    jaguar: 'Jaguar',
    jeep: 'Jeep',
    kia: 'Kia',
    lamborghini: 'Lamborghini',
    land_rover: 'Land Rover',
    lexus: 'Lexus',
    lincoln: 'Lincoln',
    maserati: 'Maserati',
    mazda: 'Mazda',
    mclaren: 'McLaren',
    mercedes_benz: 'Mercedes-Benz',
    mini: 'Mini',
    mitsubishi: 'Mitsubishi',
    nissan: 'Nissan',
    peugeot: 'Peugeot',
    porsche: 'Porsche',
    ram: 'Ram',
    renault: 'Renault',
    rolls_royce: 'Rolls-Royce',
    saab: 'Saab',
    subaru: 'Subaru',
    suzuki: 'Suzuki',
    tesla: 'Tesla',
    toyota: 'Toyota',
    volkswagen: 'Volkswagen',
    volvo: 'Volvo',
};

const vehicleDetailFields = [
    { label: 'Model', name: 'model', type: 'text' },
    { label: 'Variant', name: 'variant', type: 'text' },
    { label: 'Registration', name: 'registration', type: 'text' },
    { label: 'Colour', name: 'colour', type: 'text' },
];

const ownershipFields = [
    { label: 'Owned from', name: 'ownedFrom', type: 'text' },
    { label: 'Owned to', name: 'ownedTo', type: 'text' },
];

const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const AddVehicle: React.FC = () => {
    const router = useRouter();
    const { register, handleSubmit, setError, clearErrors, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<GarageFormType>({
        resolver: zodResolver(vehicleFormSchema),
    });

    const onSubmit: SubmitHandler<GarageFormType> = async (data) => {
        console.log(data);
        return;

        try {

            const formData = new FormData();
            formData.append('file', data.cover_photo[0], data.cover_photo[0].name);

            const response = await fetch('/api/aws/upload', {
                method: 'POST',
                body: formData,
            });

            const apiData = await response.json();

            if (apiData.keys) {
                const imageUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${apiData.keys[0]}`;
                const response = await addVehicleToGarage({
                    ...data,
                    make: vehicleMakes[data.make as keyof typeof vehicleMakes],
                    cover_photo: imageUrl
                });

                if (response && response.success) {
                    reset();
                    router.push(`/profile/garage/${response.id}`);
                }
            } else {
                setError('cover_photo', {
                    type: 'manual',
                    message: 'Failed to upload image.',
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div id="toast-16" className={clsx(
                "toast-box toast-top",
                { "bg-success": isSubmitSuccessful },
                { "bg-danger": errors.root },
                { "show": isSubmitSuccessful || errors.root }
            )}>
                <div className="in">
                    <div className="text">
                        {errors.root && errors.root.message}
                        {isSubmitSuccessful && "Vehicle added successfully."}
                    </div>
                </div>
                <button type="button" className="btn btn-sm btn-text-light close-button"
                    onClick={() => {
                        if (isSubmitSuccessful) {
                        } else {
                            clearErrors();
                        }
                    }}
                >OK</button>
            </div>


            {isSubmitting && <Loader transulcent />}
            <div className="section full mt-1 mb-2">
                <div className="section-title">Vehicle Photo</div>
                <div className="wide-block pb-2 pt-2">

                    <div className="custom-file-upload" id="fileUpload1">
                        <input type="file" id="fileuploadInput" accept=".png, .jpg, .jpeg"
                            {...register('cover_photo')}
                        />
                        <label htmlFor="fileuploadInput">
                            <span>
                                <strong>
                                    <IonIcon icon={cloudUploadOutline} role="img" className="md hydrated" aria-label="cloud upload outline" />
                                    <i>Tap to Upload</i>
                                </strong>
                            </span>
                        </label>
                    </div>
                    {errors.cover_photo && <span className="text-danger text-xs">{errors.cover_photo.message?.toString()}</span>}
                </div>
            </div>

            <div className="section full mb-2">
                <div className="section-title">Vehicle Details</div>
                <div className="wide-block pb-1 pt-1">
                    <div className="form-group basic horizontal">
                        <div className="input-wrapper">
                            <div className="row align-items-center">
                                <div className="col-3 mb-2 text-xs"><label>Make *</label></div>
                                <div className="col-9 mb-2">
                                    <select className="form-control form-select" {...register('make')}>
                                        <option disabled selected value=''>Please Select</option>
                                        {Object.entries(vehicleMakes).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                    {errors.make && <span className="text-danger text-xs">{errors.make.message}</span>}
                                </div>

                                {vehicleDetailFields.map((field) => (
                                    <>
                                        <div className="col-3 mb-2 text-xs"><label>{field.label}</label></div>
                                        <div className="col-9 mb-2">
                                            <div className="input-wrapper">
                                                <label className="form-label"></label>
                                                <input type={field.type} className={clsx(
                                                    "form-control",
                                                    errors[field.name as keyof GarageFormType] && "!border-red-600"
                                                )}
                                                    placeholder={`Enter ${field.label}`}
                                                    {...register(field.name as keyof GarageFormType)}
                                                />
                                                <i className="clear-input">
                                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                                </i>
                                            </div>
                                            {errors[field.name as keyof GarageFormType] && <span className="text-danger text-xs">{errors[field.name as keyof GarageFormType]?.message?.toString()}</span>}
                                        </div>
                                    </>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NextUIProvider>
                <div className="section full mb-2">
                    <div className="section-title">Ownership dates</div>
                    <div className="wide-block pb-1 pt-1">
                        <div className="form-group basic horizontal">
                            <div className="input-wrapper">
                                <div className="row align-items-center">
                                    {ownershipFields.map((field) => (
                                        <>
                                            <div className="col-12 mb-2 text-xs"><label>{field.label}</label></div>
                                            <div className="col-12 mb-2">
                                                <div className="input-wrapper">
                                                    <label className="form-label"></label>
                                                    {/* <Pickadate.InputPicker
                                                        key={field.name}
                                                        className={clsx(
                                                            "form-control date-picker",
                                                            errors[field.name as keyof GarageFormType] && "!border-red-600"
                                                        )}
                                                        placeholder={`Enter ${field.label}`}

                                                    // {...register(field.name as keyof GarageFormType)}
                                                    /> */}

                                                    <DatePicker
                                                        isRequired
                                                        className={clsx(
                                                            errors[field.name as keyof GarageFormType] && "!border-red-600"
                                                        )}
                                                        variant='underlined'
                                                        showMonthAndYearPickers
                                                        onChange={(date) => {
                                                            register(field.name as keyof GarageFormType).onChange({
                                                                target: {
                                                                    value: date.toString(),
                                                                    name: field.name
                                                                },
                                                            });
                                                        }}
                                                        maxValue={today(getLocalTimeZone())}
                                                    // {...register(field.name as keyof GarageFormType)}
                                                    />

                                                    {/* <input type={field.type}
                                                    // id={field.name === 'ownedFrom' ? 'input_from' : 'input_to'}
                                                    className={clsx(
                                                        "form-control date-picker",
                                                        errors[field.name as keyof GarageFormType] && "!border-red-600"
                                                    )}
                                                    placeholder={`Enter ${field.label}`}
                                                    {...register(field.name as keyof GarageFormType)}
                                                /> */}
                                                    <i className="clear-input">
                                                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                                    </i>
                                                    {errors[field.name as keyof GarageFormType] && <span className="text-danger text-xs">{errors[field.name as keyof GarageFormType]?.message?.toString()}</span>}
                                                </div>
                                            </div>
                                        </>
                                    ))}

                                    {/* <div className="col-3 mb-2"><label>Variant</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="Model variant (if applicable)" />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                        </i>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NextUIProvider>


            <div className="section full mt-1 mb-2">
                <div className="section-title">Vehicle Tagging</div>
                <div className="wide-block pb-2 pt-2">
                    <ul className="listview simple-listview">
                        <li>
                            <div>Allow this vehicle to be discovered &amp; tagged via it's registration</div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="SwitchCheckDefault1"
                                    {...register('allow_tagging')}
                                />
                                <label className="form-check-label" htmlFor="SwitchCheckDefault1"></label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="fixed bottom-1 w-full px-1 z-30">
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding vehicle...' : 'Add Vehicle'}
                </button>
            </div>
        </form>
    );
};