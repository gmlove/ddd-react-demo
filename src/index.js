class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">{category}</th>
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    const name = product.stocked ? (
      product.name
    ) : (
      <span style={{ color: "red" }}>{product.name}</span>
    );

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows = [];

    var products = this.props.products.filterByName(filterText);
    if (inStockOnly) {
      products = products.filterStocked();
    }
    products.groupByCategories().forEach(categoryProducts => {
      const category = categoryProducts[0];
      const products = categoryProducts[1];
      rows.push(
        <ProductCategoryRow
          category={category}
          key={category}
        />
      );
      products.forEach(product => rows.push(<ProductRow product={product} key={product.name} />));
    })

    // this.props.products.forEach((product) => {
    //   if (product.name.indexOf(filterText) === -1) {
    //     return;
    //   }
    //   if (inStockOnly && !product.stocked) {
    //     return;
    //   }
    //   if (product.category !== lastCategory) {
    //     rows.push(
    //       <ProductCategoryRow
    //         category={product.category}
    //         key={product.category}
    //       />
    //     );
    //   }
    //   rows.push(<ProductRow product={product} key={product.name} />);
    //   lastCategory = product.category;
    // });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleInStockChange(e) {
    this.props.onInStockChange(e.target.checked);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockChange}
          />{" "}
          Only show products in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: "",
      inStockOnly: false,
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText,
    });
  }

  handleInStockChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly,
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockChange={this.handleInStockChange}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}


class Product {

  constructor(category, price, stocked, name) {
    this.category = category;
    this.price = price;
    this.stocked = stocked;
    this.name = name;
  }

}

class ProductList{

  constructor(productList) {
    this.productList = productList
  }

  filterByName(nameFilter) {
    return new ProductList(this.productList.filter(product => product.name.indexOf(nameFilter) !== -1));
  }

  filterStocked() {
    return new ProductList(this.productList.filter(product => product.stocked));
  }

  groupByCategories() {
    var categoryProducts = {};
    this.productList.forEach(product => {
      if (categoryProducts[product.category]) {
        categoryProducts[product.category].push(product);
      } else {
        categoryProducts[product.category] = [product];
      }
    });
    categoryProducts = Object.keys(categoryProducts).map(category => [category, categoryProducts[category]]);
    return categoryProducts;
  }

}

class ProductService {

  retrieveProducts() {
    // 从服务器端获取数据
    return new ProductList([
      new Product("Sporting Goods", "$49.99", true, "Football"),
      new Product("Sporting Goods", "$9.99", true, "Baseball"),
      new Product("Sporting Goods", "$29.99", false, "Basketball"),
      new Product("Electronics", "$99.99", true, "iPod Touch"),
      new Product("Electronics", "$399.99", false, "iPhone 5"),
      new Product("Electronics", "$199.99", true, "Nexus 7")
    ])
  }

}


class Globals {

  constructor() {
    this.productService = new ProductService();
  }

}

window.globals = new Globals();


const PRODUCTS = [
  {
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football",
  },
  {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball",
  },
  {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball",
  },
  {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch",
  },
  {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5",
  },
  {
    category: "Electronics",
    price: "$199.99",
    stocked: true,
    name: "Nexus 7"
  },
];

ReactDOM.render(
  <FilterableProductTable products={globals.productService.retrieveProducts()} />,
  document.getElementById("container")
);
