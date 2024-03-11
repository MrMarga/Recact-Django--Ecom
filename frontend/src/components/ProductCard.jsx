import React from "react"
import { Card, CardBody, Form } from "react-bootstrap"
import Rating from "./Rating"
import { Link } from "react-router-dom"

function ProductCard({product}) {
  return (
      <Card className="my-3 p-3 rounded">
           
            <Link className="text-link" to={`/product/${product._id}`}>
              <Card.Img src={product.image} />
            </Link>

          <Card.Body>

            <Link className="text-link" to={`/product/${product._id}`}>
             <Card.Title>
              <strong>{product.name}</strong>
             </Card.Title>
            </Link>

             <Card.Text as='div'>
               <div className="my-3">
                 <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#F9A602'} />
               </div> 
             </Card.Text>
             <Card.Text as='h3'>
                 <div>${product.price}</div>
             </Card.Text>
          </Card.Body>
      </Card>
  )
}

export default ProductCard



