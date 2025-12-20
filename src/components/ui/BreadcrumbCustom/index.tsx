import {useLocation, useSearchParams} from 'react-router-dom';
import { Container } from '../../shared';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import './index.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
import { path } from '../../../common/constants/path.ts';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

export const Breadcrumb = () => {
    const {categories,seasons}=useSelector((state:RootState)=>state.attribute)
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const crumbPath = _.compact(location.pathname.split('/')).map((crumb, index, arr) => {
        const crumbLink = `/${_.take(arr, index + 1).join('/')}`;
        return (
            <div className="breadcrumb__container--crumb">
                <Icon icon="material-symbols:chevron-right-rounded" />
                {index < arr.length - 1 ? (
                    <Link to={crumbLink} key={crumb} className="breadcrumb__container--crumb-link">
                        {_.startCase(crumb)}
                    </Link>
                ) : (
                    <span className="breadcrumb__container--crumb-span">{_.startCase(crumb)}</span>
                )}
            </div>
        );
    });
    console.log(location.pathname);

    return (
        <div className="breadcrumb">
            <Container>
                <nav className="breadcrumb__container">
                    <div className="breadcrumb__container--crumb">
                        <Link to={path.INDEX} className="breadcrumb__container--crumb-link">
                            <Icon icon="ic:round-home" />
                            Home
                        </Link>
                    </div>
                    {crumbPath} {
                    searchParams?.get('category')
                        ?':'+categories?.find((item)=>item.id===searchParams?.get('category'))?.name
                        :searchParams?.get('season')
                            ?':'+seasons?.find((item)=>item.id===searchParams?.get('season'))?.name
                            :``}
                    {searchParams?.get('category')||searchParams?.get('season')?`trang ${searchParams?.get('page')}`:''}
                </nav>
            </Container>
        </div>
    );
};

export default Breadcrumb;
