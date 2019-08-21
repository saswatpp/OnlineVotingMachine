import _ from 'lodash'
import faker from 'faker'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import Axios from 'axios';

const initialState = { isLoading: false, results: [], value: '' }

export default class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...initialState,
      source: []
    };
  }

  handleResultSelect = (e, { result }) => {
      var {onSelectItem} = this.props;
      this.setState({ value: result.title })
      onSelectItem(result);
    }


  handleSearchChange = (e, { value }) => {
    // console.log(value)
    this.setState({ isLoading: true, value })
    var {source} = this.state;

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: source.filter(isMatch),
      })
    }, 300)
  }


  componentWillMount = () => {
    Axios.get("http://localhost:5000/constituency")
    .then(res =>{
      var data = res.data.constituency_all_info;
      var source = data.map((item) => ({
        id: item.SerialNo,
        title: item.Name,
        description: "this is a ancient constituency",
        image: faker.internet.avatar(),
        price: faker.finance.amount(0, 100, 2, '$'),
      }))
      this.setState({source: source})
    })
  }


  render() {
    const { isLoading, value, results } = this.state
    return (
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
            fluid={true}
            className="searchBar"
            {...this.props}
          />
    )
  }
}