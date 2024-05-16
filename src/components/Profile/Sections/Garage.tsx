import Link from "next/link";

export const Garage: React.FC = () => {
    return (
        <div className="tab-pane fade show active" id="garage" role="tabpanel">
            <ul className="listview image-listview flush transparent pt-1 px-2">
                <li>
                    <Link href="#" className="item rounded-lg bg-theme-dark-100/10 !p-0 py-2">
                        <img src="https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1562246346/autoexpress/2018/05/_86a0671.jpg" alt="image" className="max-w-32 mr-3 object-contain h-full" />
                        <div className="in">
                            <div className="font-semibold text-lg text-black">
                                Ford Mustang
                                <div className="text-muted font-normal">Mach 1</div>
                            </div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};