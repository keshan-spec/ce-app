'use client';
import { getQueryClient } from "@/app/context/QueryClientProvider";
import { Garage } from "@/types/garage";
import { Post } from "@/types/posts";

import { useCallback } from "react";

interface TopNavProps {
    pathname: string;
}

export type TopNavMode = 'view-page' | 'default';

interface TopNavType {
    returnTo: string;
    title: string;
    mode: TopNavMode;
    showMenuIcon: boolean;
    showHeaderIcons: boolean;
    showLogo: boolean;
    subtitle: string;
}

const queryClient = getQueryClient();

export const useTopNav = ({
    pathname
}: TopNavProps): TopNavType => {
    const isGarageViewPage = pathname.includes('/profile/garage/');
    const isPostViewPage = pathname.includes('/posts/');
    const param = pathname.split('/').pop();

    const showMenuIcon = () => {
        if (pathname.includes('/profile') || pathname.includes('/posts/')) {
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

        return '';
    }, [isGarageViewPage, isPostViewPage, param]);

    return {
        returnTo: getReturnTo(pathname),
        title: getHeaderTitle(),
        subtitle: getSubtitle(),
        mode: isGarageViewPage || isPostViewPage ? 'view-page' : 'default',
        showMenuIcon: showMenuIcon(),
        showHeaderIcons: !isGarageViewPage && !isPostViewPage,
        showLogo: !isGarageViewPage && !isPostViewPage,
    };
};

function getReturnTo(pathname: string): string {
    if (pathname.includes('/profile/garage/')) {
        return '/profile';
    }

    if (pathname.includes('/posts/')) {
        return '/profile';
    }

    return '/';
}