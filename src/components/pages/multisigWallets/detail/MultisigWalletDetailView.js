import React, { Component } from 'react'

class MultisigWalletDetailView extends Component {
  componentDidMount () {
    this.props.loadMultisigWallet()
      .then(addresses => {
        this.setState({ addresses })
      })
  }

  render () {
    const { addresses } = this.state

    return (
      <div className='multisigWalletDetailComponent'>
      </div>
    )
  }
}

export default MultisigWalletDetailView
