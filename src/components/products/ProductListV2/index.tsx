import { IProduct } from '@/common/models/Product';
import { Modal } from '../../../components/ui';
import useModal from '../../../hooks/useModal';
import { ProductCard } from '../ProductCard';
import { ProductDetailFrame } from '../ProductDetailFrame';
import './index.scss';
import {ProductCardV2} from "@/components/products/ProductCardV2";

interface ProductListProps {
    products: IProduct[] | undefined;
    isSearchable: boolean;
}

const ProductListV2 = ({ products, isSearchable = true }: ProductListProps) => {
    const { openModal, handleCloseModal, handleOpenModal, dataModal } = useModal();
    console.log("filteredProducts",{products})
    return (
        <>
            <Modal type="center" onClose={handleCloseModal} open={openModal}>
                <ProductDetailFrame productModal={dataModal} />
            </Modal>
            <div className={`product-list${!isSearchable ? '--home' : ''}`}>
                {products &&
                    products.map((item,index) => (
                        <div key={item?.productId} className="product-list__item">
                            <ProductCardV2 handleOpenModal={handleOpenModal} product={item} />
                        </div>
                    ))}
            </div>
        </>
    );
};

export default ProductListV2;
