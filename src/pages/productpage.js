import React from "react";
import Firebase from "firebase";
import { withRouter } from "react-router-dom";

class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };
  }

  componentDidMount() {
    const productId = this.props.match.params.id; // get the id from the route params
    console.log('Product ID:', productId); // debug line to check the ID

    // get the specific product details from firebase
    const db = Firebase.database().ref(`images/${productId}`);
    db.on('value', snapshot => {
      const product = snapshot.val();

      if (product) {
        this.setState({ product });
      } else {
        console.log(`No product found with id: ${productId}`);
      }
    });
}


  render() {
    const { product } = this.state;

    // display a loading message while the product data is being fetched
    if (!product) {
      return <div>Loading product...</div>;
    }

    // Format the timestamp as a date string
    const timestamp = new Date(product.timestamp).toLocaleString();

    return (
        <div className="product-page">
        <h2>{product.title}</h2>
        <p>{product.shortdescription}</p>
        <p>{product.longdescription}</p>
        <p>Uploaded on: {timestamp}</p>
        <div className="image-container">
          {product.imageURLs && product.imageURLs.map((imageUrl, imgIndex) => (
            <div key={imgIndex}>
              <img src={imageUrl} alt="product" />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(ProductPage);
