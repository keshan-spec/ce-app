'use client';
import { getQueryClient } from "@/app/context/QueryClientProvider";
import { Garage } from "@/types/garage";
import { Post } from "@/types/posts";
import { useRouter, useSearchParams } from "next/navigation";

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
    '/profile/edit/',
    '/garage',
    '/garage/edit/',
    '/garage/add',
    '/edit-post/',
    '/notifications',
];

export const footerLessPaths = [
    '/store/product/',
    '/post/',
    '/cart',
    '/checkout',
    '/checkout/payment-success',
    '/profile/edit/',
    '/garage/edit/',
    '/garage/add',
    '/edit-post/',
    '/notifications',
];

export const useTopNav = ({
    pathname
}: TopNavProps): TopNavType => {
    const searchParam = useSearchParams();

    const isGarageViewPage = pathname.includes('/profile/garage/');
    const isPostViewPage = pathname.includes('/post/') || pathname.includes('/edit-post/');
    const isProfileEditView = pathname.includes('/profile/edit/');
    const isGarageEditView = pathname.includes('/garage');
    const isGarageAddPage = pathname.includes('/garage/add');
    const isDiscoverPage = pathname.includes('/discover') && searchParam.get('dtype') === 'search';

    const param = pathname.split('/').pop();
    const router = useRouter();
    const { user } = useUser();

    const showMenuIcon = () => {
        if (searchParam.get('dtype') && searchParam.get('dtype') === 'search') {
            return false;
        }

        if (menuIconLessPaths.some((path) => pathname.includes(path))) {
            return false;
        }

        return true;
    };

    const getSubtitle = () => {
        if (isDiscoverPage) {
            return 'Discover Anything';
        }

        if (isGarageViewPage) {
            return 'Garage';
        }

        if (isGarageEditView) {
            return `@${user?.username}`;
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
        if (isDiscoverPage) {
            return 'Search';
        }

        if (isGarageAddPage) {
            return 'Add Vehicle';
        }

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

        if (isGarageEditView) {
            return 'Edit Garage';
        }

        return '';
    }, [isGarageViewPage, isPostViewPage, param, isDiscoverPage]);

    const returnTo = () => {
        if (searchParam.get('ref')) {
            const ref = searchParam.get('ref');

            if (ref === 'search') {
                return window.history.length > 1 ? router.back() : router.push('/');
            }

            if (ref === 'redirect') {
                return router.push('/');
            }

            if (ref === 'store') {
                return router.push('/store');
            }

            if (ref === 'garage') {
                return router.push('/garage');
            }
        }

        if (pathname.includes('/profile/garage/')) {
            return window.history.length > 1 ? router.back() : router.push('/');
        }

        if (pathname.includes('/garage')) {
            return router.push('/profile');
        }

        if (pathname === '/profile') {
            return router.push('/');
        }

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
        mode: isGarageViewPage || isPostViewPage || isProfileEditView || isGarageEditView || isDiscoverPage ? 'view-page' : 'view-page',
        showMenuIcon: showMenuIcon(),
        showHeaderIcons: !isGarageViewPage && !isPostViewPage && !isProfileEditView && !isGarageEditView && !isDiscoverPage,
        showLogo: !isGarageViewPage && !isPostViewPage && !isProfileEditView && !isGarageEditView && !isDiscoverPage,
    };
};