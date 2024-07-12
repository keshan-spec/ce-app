'use client';
import { fetchTaggableEntites } from '@/actions/post-actions';
import { addUserProfileLinks, removeProfileLink, updateSocialLinks } from '@/actions/profile-actions';
import { ExternalLinkType } from '@/auth';
import { useUser } from '@/hooks/useUser';
import { SocialMediaLinks, socialMediaSchema } from '@/zod-schemas/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { IonIcon } from '@ionic/react';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { closeCircleOutline, linkOutline } from 'ionicons/icons';
import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';



const fields = [
    { name: "instagram", label: "Instagram" },
    { name: "facebook", label: "Facebook" },
    { name: "tiktok", label: "TikTok" },
    { name: "youtube", label: "YouTube" },
    { name: "custodian", label: "Custodian" },
    { name: "mivia", label: "Mivia" }
];

const AddSocialMediaLinks: React.FC<{ user: { profile_links: SocialMediaLinks; }; }> = ({ user }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<SocialMediaLinks>({
        resolver: zodResolver(socialMediaSchema),
        defaultValues: user.profile_links
    });
    const [custodianSearch, setCustodianSearch] = useState([]);

    const onSubmit: SubmitHandler<SocialMediaLinks> = async (data) => {
        try {
            const response = await updateSocialLinks(data);
            reset(data);
            console.log("Links added successfully:", response);
        } catch (error) {
            console.error("Error adding links:", error);
        }
    };

    const onCustodianChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        try {
            const response = await fetchTaggableEntites(value, [], false);
            console.log("Custodian search results:", response);
        } catch (error) {
            console.log("Error searching for custodian:", error);
        }
    }, []);

    return (
        <div className="wide-block pb-1 pt-1">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group basic horizontal">
                    <div className="input-wrapper">
                        <div className="row align-items-center">
                            {fields.map((field) => (
                                <div key={field.name} className="col-12 mb-2">
                                    <div className="row align-items-center">
                                        <div className="col-3">
                                            <label>{field.label}</label>
                                        </div>
                                        <div className="col-9">
                                            <div className="input-wrapper">
                                                <label className="form-label"></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={`${field.label} Username`}
                                                    {...register(field.name as keyof SocialMediaLinks)}
                                                />
                                                <i className="clear-input">
                                                    <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                                </i>
                                                {errors[field.name as keyof SocialMediaLinks] && (
                                                    <div className="text-xs text-red-600">{errors[field.name as keyof SocialMediaLinks]?.message}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="form-group basic">
                    <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || !isDirty}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const AddLinkSheet: React.FC<{
    onAdd: (link: ExternalLinkType) => void;
}> = ({
    onAdd
}) => {
        const schema = z.object({
            label: z.string().min(1, "Link Title is required"),
            url: z.string().url("Invalid URL")
        });

        const { reset, register, setError, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
            resolver: zodResolver(schema)
        });

        const onExternalLinkAdd: SubmitHandler<z.infer<typeof schema>> = async (data) => {
            try {
                const response = await addUserProfileLinks({
                    link: data,
                    type: 'external_links'
                });
                if (response?.success && response.id) {
                    onAdd({
                        id: response.id,
                        link: data
                    });

                    reset(); // reset form
                    return;
                }

                throw new Error(response?.message || "Error adding link");
            } catch (error: any) {
                setError("root", {
                    message: error.message || "Error adding link"
                });
            }
        };

        return (
            <div className="offcanvas offcanvas-bottom action-sheet" tabIndex={-1} id="addlinkSheet" style={{
                visibility: 'visible'
            }} aria-modal="true" role="dialog">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Add Custom Link</h5>
                </div>
                <div className="offcanvas-body">
                    <div className="action-sheet-content">
                        <form onSubmit={handleSubmit(onExternalLinkAdd)}>
                            <div className="form-group basic">
                                <div className="input-wrapper">
                                    <label className="form-label" htmlFor="linkTitle">Link Title</label>
                                    <input type="text" className="form-control" id="linkTitle" placeholder="E.g. Our Website" {...register("label")} />
                                    <i className="clear-input">
                                        <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                    </i>
                                    {errors.label && <div className="text-xs text-red-600">{errors.label.message}</div>}
                                </div>
                            </div>

                            <div className="form-group basic">
                                <div className="input-wrapper">
                                    <label className="form-label" htmlFor="linkUrl">Link URL</label>
                                    <input type="text" className="form-control" id="linkUrl" placeholder="E.g https://www.mylink.com" {...register("url")} />
                                    <i className="clear-input">
                                        <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                    </i>
                                    {errors.url && <div className="text-xs text-red-600">{errors.url.message}</div>}
                                </div>
                                <div className="input-info">Including https://</div>
                            </div>

                            {errors.root && <div className="text-xs text-red-600 text-center py-2 bg-red-100 rounded-sm">{errors.root.message}</div>}

                            <div className="form-group basic">
                                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Save'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        );
    };

export const EditSocialLinks: React.FC = () => {
    const { user, isLoggedIn } = useUser();
    const [externalLinks, setExternalLinks] = useState(user?.profile_links.external_links || []);

    const { mutate, error, isPending, variables } = useMutation({
        mutationFn: removeProfileLink,
        mutationKey: ['remove-profile-link'],
        onSuccess: () => {
            if (variables) {
                deleteProfileLink(variables);
            }
        }
    });

    const deleteProfileLink = useCallback((id: string) => {
        // remove from UI
        const updatedLinks = externalLinks?.filter(link => link.id !== id);
        setExternalLinks(updatedLinks);
    }, [externalLinks]);

    const renderExternalLinks = useCallback(() => {
        return externalLinks.length > 0 ? (
            <ul className="listview simple-listview mb-2 border-top-0">
                {externalLinks.map(({
                    id, link
                }, i) => (
                    <li className={clsx(
                        "pl-0 flex items-center w-full",
                        isPending && variables === id && 'opacity-50',
                        error && variables === id && 'bg-red-100 flex-col'
                    )} key={i}>
                        <div className="flex w-full items-center">
                            <div className="flex gap-2 justify-between w-full mr-4">
                                <span className='font-medium'>{link.label}</span>
                                <span className='truncate text-muted text-xs max-w-[200px]'>
                                    <a href={link.url} target='_'>
                                        <IonIcon icon={linkOutline} role="img" className="text-lg" aria-label="link outline" />
                                    </a>
                                </span>
                            </div>
                            <button onClick={() => mutate(id)}>
                                <IonIcon icon={closeCircleOutline} role="img" className="text-lg" aria-label="close circle outline" />
                            </button>
                        </div>

                        {error && variables === id && (
                            <div className="text-xs text-red-600">{error.message}</div>
                        )}
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-4">No custom links added</div>
        );
    }, [externalLinks, isPending, variables, error]);

    const onExternalLinkAdd = useCallback((link: ExternalLinkType) => {
        setExternalLinks([...externalLinks, link]);
    }, [externalLinks]);

    if (!isLoggedIn || !user) return null;

    return (
        <>
            <div className="section full mt-2 mb-2">
                <div className="section-title">Social Links</div>
                <AddSocialMediaLinks user={user} />
            </div>

            <div className="section full mt-2 mb-2">
                <div className="section-title">Custom links</div>
                <div className="wide-block pb-1 pt-0">
                    {renderExternalLinks()}

                    <button type="button" className="btn btn-primary btn-block" data-bs-toggle="offcanvas" data-bs-target="#addlinkSheet">+ Add</button>
                    <AddLinkSheet onAdd={(link) => onExternalLinkAdd(link)} />
                </div>
            </div>
        </>
    );
};