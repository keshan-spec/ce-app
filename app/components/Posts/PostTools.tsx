import { Menu, Transition } from '@headlessui/react'
import { deletePost } from '../../api/posts';
import { Fragment } from 'react'
import { useObservedQuery } from '../../hooks/useObservedQuery';

interface PostToolsProps {
    postId: string;
    onActionComplete?: (action: string) => void;
}


export const PostTools: React.FC<PostToolsProps> = ({
    postId,
    onActionComplete = () => { }
}) => {
    const { refetch } = useObservedQuery();

    const handleDelete = async () => {
        const response = await deletePost(postId);

        if (!response) {
            onActionComplete('Failed to delete post.');
            return;
        }

        refetch();
        onActionComplete('Deleted post');
    }

    const handleArchive = async () => {
        onActionComplete('Archived post');

    }

    return (
        <div className="absolute top-7 right-4 w-56 text-right">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md  px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        <i className="fas fa-ellipsis-h ml-2"></i>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute flex -right-4 mt-2 w-fit origin-center divide-x divide-gray-100 rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleArchive}
                                        className={`text-white ${active ? 'bg-white/20' : ''
                                            } group flex w-full items-center rounded-md p-3 text-xs`}
                                    >

                                        <i className="fas fa-archive text-sm"></i>
                                        {/* Archive */}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleDelete}
                                        className={`text-white ${active ? 'bg-white/20' : ''
                                            } group flex w-full items-center rounded-md p-3 text-xs`}
                                    >
                                        <i className="fas fa-trash-can text-sm"></i>
                                        {/* Delete */}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}