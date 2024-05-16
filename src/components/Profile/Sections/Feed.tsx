
export const Feed: React.FC = () => {
    return (
        <div className="tab-pane fade" id="feed" role="tabpanel">
            <UserPosts />
            <div className="p-2 pt-0 pb-0">
                <a href="#" className="btn btn-primary btn-block">More Photo</a>
            </div>
        </div>
    );
};


interface UserPostsProps {
    tagged?: boolean;
}

export const UserPosts: React.FC<UserPostsProps> = ({ tagged }) => {
    return (
        <div className="mt-2 p-2 pt-0 pb-0">
            <div className="row">
                <div className="col-4 mb-2">
                    <img src="assets/img/sample/photo/1.jpg" alt="image" className="imaged w-100" />
                </div>
            </div>
        </div>
    );
};