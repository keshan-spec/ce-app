import { Posts } from '@/components/Posts/Posts';
import { UserPosts } from './Feed';

export const Tags: React.FC = () => {
    return (
        <div className="tab-pane fade" id="tagged-posts" role="tabpanel">
            <UserPosts />
            <div className="p-2 pt-0 pb-0">
                <a href="#" className="btn btn-primary btn-block">More Tagged Posts</a>
            </div>
        </div>
    );
};