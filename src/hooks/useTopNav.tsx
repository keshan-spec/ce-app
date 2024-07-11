'use client';
import { getQueryClient } from "@/app/context/QueryClientProvider";
import { Garage } from "@/types/garage";
import { Post } from "@/types/posts";
import { useRouter } from "next/navigation";

import { useCallback } from "react";
import { useUser } from "./useUser";

interface TopNavProps {
    pathname: string;
}

export type TopNavMode = 'view-page' | 'default';

interface TopNavType {
    returnTo: () => void;
    title: string;
    mode: TopNavMode;
    showMenuIcon: boolean;
    showHeaderIcons: boolean;
    showLogo: boolean;
    subtitle: string;
}

const queryClient = getQueryClient();

export const menuIconLessPaths = [
    '/profile',
    '/store/product/',
    '/post/',
    '/cart',
    '/checkout',
    '/checkout/payment-success',
    '/profile/edit/'
];

export const useTopNav = ({
    pathname
}: TopNavProps): TopNavType => {
    const isGarageViewPage = pathname.includes('/profile/garage/');
    const isPostViewPage = pathname.includes('/posts/');
    const isProfileEditView = pathname.includes('/profile/edit/');
    const param = pathname.split('/').pop();
    const router = useRouter();
    const { user } = useUser();

    const showMenuIcon = () => {
        if (menuIconLessPaths.some((path) => pathname.includes(path))) {
            return false;
        }

        return true;
    };

    const getSubtitle = () => {
        if (isGarageViewPage) {
            return 'Garage';
        }

        if (isPostViewPage) {
            return 'Posts';
        }

        if (isProfileEditView) {
            return `@${user?.username}`;
        }

        return '';
    };

    const getHeaderTitle = useCallback(() => {
        if (isGarageViewPage) {
            const qk = ['view-garage', param];
            const data = queryClient.getQueryData<Garage | null>(qk);

            if (data) {
                return `@${data.owner?.username}`;
            }

            return 'User Garage';
        }

        if (isPostViewPage) {
            const qk = ['view-post', param];
            const data = queryClient.getQueryData<Post | null>(qk);

            if (data) {
                return `@${data.username}`;
            }

            return 'User Posts';
        }

        if (isProfileEditView) {
            return 'Edit Profile';
        }

        return '';
    }, [isGarageViewPage, isPostViewPage, param]);

    const returnTo = () => {
        if (pathname.includes('checkout/payment-success')) {
            return router.push('/store');
        } else {
            return window.history.length > 1 ? router.back() : router.push('/');
        }
    };

    return {
        returnTo: () => returnTo(),
        title: getHeaderTitle(),
        subtitle: getSubtitle(),
        mode: isGarageViewPage || isPostViewPage || isProfileEditView ? 'view-page' : 'default',
        showMenuIcon: showMenuIcon(),
        showHeaderIcons: !isGarageViewPage && !isPostViewPage && !isProfileEditView,
        showLogo: !isGarageViewPage && !isPostViewPage && !isProfileEditView,
    };
};