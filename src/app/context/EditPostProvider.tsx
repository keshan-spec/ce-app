'use client';
import { fetchPost } from "@/api-functions/posts";
import { Post } from "@/types/posts";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

interface EditPostContextType {
    post: Post | null | undefined;
    loading: boolean;
    error: any;
}

const EditPostContext = createContext<EditPostContextType | undefined>(undefined);

const EditPostProvider: React.FC<{ children: ReactNode; post_id: string; }> = ({ children, post_id }) => {
    const { data, error, isLoading, isFetching } = useQuery<Post | null, Error>({
        queryKey: ["view-post", post_id],
        queryFn: () => fetchPost(post_id),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    return (
        <EditPostContext.Provider value={{ post: data, loading: isLoading, error }}>
            {children}
        </EditPostContext.Provider>
    );
};

const useEditPost = () => {
    const context = useContext(EditPostContext);
    if (context === undefined) {
        throw new Error('useEditPost must be used within a EditPostProvider');
    }
    return context;
};

export { EditPostContext, useEditPost };

export default EditPostProvider;