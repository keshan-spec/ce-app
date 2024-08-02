interface LoaderProps {
    transulcent?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
    transulcent = false
}) => {
    return (
        <div id="loader" className={`${transulcent && '!bg-white/80'}`}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );
};