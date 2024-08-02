'use client';
import { IonIcon } from "@ionic/react";
import { closeCircle, cloudUploadOutline } from "ionicons/icons";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from "clsx";
import { addVehicleToGarage, deleteVehicleFromGarage, updateVehicleInGarage } from "@/actions/garage-actions";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";

import { DatePicker, NextUIProvider } from "@nextui-org/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useEffect, useRef, useState } from "react";


// Zod schema for validation
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const REGISTRATION_FORMAT = /^[a-zA-Z0-9\-_]{1,20}$/;

const vehicleFormSchema = z.object({
    cover_photo: z.any(),
    // .refine((files) => files?.length == 1, "Image is required.")
    // // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    // .refine(
    //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    //     ".jpg, .jpeg, .png and .webp files are accepted."
    // ),
    make: z.string().min(1, 'Please select a make'),
    model: z.string().min(1, 'Model is required'),
    variant: z.string().optional(),
    registration: z.string().min(1, 'Registration number is required'),//.regex(REGISTRATION_FORMAT, 'Registration number is invalid'),
    colour: z.string().optional(),
    ownedFrom: z.string().min(1, 'Owned from date is required'),
    ownedTo: z.string().optional(),
    allow_tagging: z.boolean().optional(),
    vehicle_period: z.enum(['current', 'past']),
}).refine((data) => {
    if (data.vehicle_period === 'past' && !data.ownedTo) {
        return false;
    }
    return true;
}, {
    message: 'Owned to is required when vehicle is past',
    path: ['ownedTo'],
});

export type GarageFormType = z.infer<typeof vehicleFormSchema>;

export const vehicleMakes = {
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
    { label: 'Model', name: 'model', type: 'text', required: true },
    { label: 'Variant', name: 'variant', type: 'text', required: true },
    { label: 'Registration', name: 'registration', type: 'text', required: true },
    { label: 'Colour', name: 'colour', type: 'text', required: false },
];

const ownershipFields = [
    { label: 'Owned from', name: 'ownedFrom', type: 'text', required: true },
    { label: 'Owned to', name: 'ownedTo', type: 'text', required: true },
];

interface AddVehicleProps {
    isEditing?: boolean;
    vehicleValues?: GarageFormType;
    garageId?: string;
}

const AddVehicle: React.FC<AddVehicleProps> = ({
    isEditing = false,
    vehicleValues,
    garageId
}) => {
    const router = useRouter();
    const { register, handleSubmit, setError, clearErrors, reset, watch, formState: { errors, isSubmitting, isSubmitSuccessful, isDirty, dirtyFields } } = useForm<GarageFormType>({
        resolver: zodResolver(vehicleFormSchema),
        defaultValues: vehicleValues,
    });

    const showOwnedTo = watch('vehicle_period', 'current');
    const defaultFrom = vehicleValues?.ownedFrom ? parseDate(vehicleValues?.ownedFrom) : null;
    const defaultTo = vehicleValues?.ownedTo ? parseDate(vehicleValues?.ownedTo) : null;

    const fileUploadRef = useRef<HTMLLabelElement>(null);
    const [fileLabelText, setFileLabelText] = useState('');
    const filelabelDefault = 'Tap to Upload';

    useEffect(() => {
        if (vehicleValues?.cover_photo?.length) {
            setFileLabelText('Click to update image');
        }
    }, [vehicleValues]);

    const onSubmit: SubmitHandler<GarageFormType> = async (data) => {
        const isImageDirty = dirtyFields.cover_photo;

        if (!isEditing && data.cover_photo.length === 0) {
            setError('cover_photo', {
                type: 'manual',
                message: 'Please upload an image.',
            });
            return;
        }

        if (isEditing && !vehicleValues?.cover_photo) {
            setError('cover_photo', {
                type: 'manual',
                message: 'Please upload an image.',
            });
            return;
        }

        try {
            let imageUrl = vehicleValues?.cover_photo?.[0].url || '';

            if (isImageDirty) {
                const formData = new FormData();
                formData.append('file', data.cover_photo[0], data.cover_photo[0].name);

                const response = await fetch('/api/aws/upload', {
                    method: 'POST',
                    body: formData,
                });

                const apiData = await response.json();

                if (apiData.keys) {
                    imageUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${apiData.keys[0]}`;

                } else {
                    setError('cover_photo', {
                        type: 'manual',
                        message: 'Failed to upload image.',
                    });
                    return;
                }
            }

            if (isEditing && garageId) {
                const vehicleData = {
                    ...data,
                    make: vehicleMakes[data.make as keyof typeof vehicleMakes],
                    cover_photo: imageUrl
                };

                const response = await updateVehicleInGarage(vehicleData, garageId);
                if (!response || !response.success) {
                    throw new Error('Failed to update vehicle.');
                }

                reset(data);
            } else {
                const response = await addVehicleToGarage({
                    ...data,
                    make: vehicleMakes[data.make as keyof typeof vehicleMakes],
                    cover_photo: imageUrl
                });

                if (response && response.success) {
                    reset();
                    router.push(`/profile/garage/${response.id}/?ref=garage`);
                } else {
                    throw new Error('Failed to add vehicle.');
                }
            }
        } catch (error) {
            console.error(error);
            setError('cover_photo', {
                type: 'manual',
                message: 'Failed to upload image.',
            });
        }
    };

    const onDelete = async () => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            try {
                if (garageId) {
                    const response = await deleteVehicleFromGarage(garageId);

                    if (response && response.success) {
                        router.push('/garage');
                    }
                }
            } catch (error: any) {
                setError('root', {
                    type: 'manual',
                    message: error.message || 'Failed to delete vehicle.',
                });
            }
        }
    };

    const handleFileChange = (event: any) => {
        if (!fileUploadRef.current) return;

        const file = event.target.files[0];
        const name = file ? file.name : '';
        const tmppath = file ? URL.createObjectURL(file) : '';

        if (name) {
            fileUploadRef.current.classList.add('file-uploaded');
            fileUploadRef.current.style.backgroundImage = `url(${tmppath})`;
            setFileLabelText(name);
        } else {
            fileUploadRef.current.classList.remove('file-uploaded');
            setFileLabelText(filelabelDefault);
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
                        {isSubmitSuccessful && `Vehicle ${isEditing ? 'updated' : 'added'} successfully`}
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
                    <div className="custom-file-upload" id="fileUpload1" >
                        <input type="file" id="fileuploadInput" accept=".png, .jpg, .jpeg"
                            {...register('cover_photo')}
                            onChange={(e) => {
                                handleFileChange(e);
                                register('cover_photo').onChange(e);
                            }}
                        />
                        <label htmlFor="fileuploadInput"
                            className={clsx(
                                vehicleValues?.cover_photo?.length && "file-uploaded"
                            )}
                            style={{ backgroundImage: `url(${vehicleValues?.cover_photo[0].url})` }}
                            ref={fileUploadRef}
                        >
                            <span>
                                {fileLabelText || (
                                    <strong>
                                        <IonIcon icon={cloudUploadOutline} role="img" className="md hydrated" aria-label="cloud upload outline" />
                                        <i>{filelabelDefault}</i>
                                    </strong>
                                )}
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
                                        <div className="col-3 mb-2 text-xs"><label>{field.label} {field.required && '*'}</label></div>
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
                                    <div className="col-3 mb-2 text-xs"><label>Ownership *</label></div>

                                    <div className="col-9 mb-2">
                                        <select className="form-control form-select" {...register('vehicle_period')}>
                                            <option value="current">Current vehicle</option>
                                            <option value="past">Past vehicle</option>
                                        </select>
                                    </div>

                                    {ownershipFields.map((field) => (
                                        <>
                                            <div className={clsx(
                                                "col-3 mb-2 text-xs",
                                                field.name === 'ownedTo' && showOwnedTo === 'current' && 'd-none'
                                            )}><label>{field.label} {field.required && '*'}</label></div>
                                            <div className={clsx(
                                                "col-9 mb-2",
                                                field.name === 'ownedTo' && showOwnedTo === 'current' && 'd-none'
                                            )}>
                                                <div className="input-wrapper w-full">
                                                    <label className="form-label"></label>
                                                    <DatePicker
                                                        isRequired={register(field.name as keyof GarageFormType).required}
                                                        className={clsx(
                                                            errors[field.name as keyof GarageFormType] && "!border-red-600"
                                                        )}
                                                        onBlur={register(field.name as keyof GarageFormType).onBlur}
                                                        variant='underlined'
                                                        showMonthAndYearPickers
                                                        onChange={(date) => {
                                                            register(field.name as keyof GarageFormType).onChange({
                                                                target: {
                                                                    value: date?.toString(),
                                                                    name: field.name
                                                                },
                                                            });
                                                        }}
                                                        defaultValue={field.name === 'ownedFrom' ? defaultFrom : defaultTo}
                                                        maxValue={today(getLocalTimeZone())}
                                                        name={field.name as keyof GarageFormType}
                                                        ref={register(field.name as keyof GarageFormType).ref}
                                                        fullWidth
                                                    />

                                                    <i className="clear-input">
                                                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                                    </i>
                                                    {errors[field.name as keyof GarageFormType] && <span className="text-danger text-xs">{errors[field.name as keyof GarageFormType]?.message?.toString()}</span>}
                                                </div>
                                            </div>
                                        </>
                                    ))}
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

            {isEditing ? (
                <div className="section flex">
                    <button className="btn btn-primary btn-block me-1 mb-1">Update</button>
                    <button type="button" className="btn btn-danger btn-block me-1 mb-1" onClick={onDelete}>Delete Vehicle</button>
                </div>
            ) : (
                <div className="fixed bottom-1 w-full px-1 z-30 hidden">
                    <button type="submit" className="btn btn-primary btn-block" id="garageAddForm" disabled={isSubmitting || !isDirty}>
                        {isSubmitting ? 'Adding vehicle...' : 'Add Vehicle'}
                    </button>
                </div>
            )}
        </form>
    );
};

export default AddVehicle;