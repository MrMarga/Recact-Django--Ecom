import React, { useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productsActions';
import LoaderPause from '../components/LoaderPause';
import Messages from '../components/Messages';

function HomeScreen() {
    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const { error, loading, products } = productList

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);
     
    
    return (
        <div>
            <h1>Latest Products</h1>
            {loading ? <LoaderPause />
                : error ? <Messages variant='danger'>{error}</Messages>
                    :<Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
            }
        </div>
    );
}

export default HomeScreen;

