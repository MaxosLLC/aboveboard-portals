import React, { Component } from 'react'
import { Accordion, Button, Header, Icon, Input, Label, Segment } from 'semantic-ui-react'

class MultisigWalletsView extends Component {
  constructor (props) {
    super(props)
    this.state = { changeWallet: false }
  }

  componentDidMount () {
    this.props.loadMultisigWallet()

    this.props.getCurrentRequirement()
      .then(currentRequirement => this.setState({ currentRequirement }))

    this.props.getOwners()
      .then(currentOwners => this.setState({ currentOwners }))
  }

  handleAccordionClick (e, titleProps) {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render () {
    const { loaded, multisigWallet, addMultisigWallet, changeMultisigWallet, sendTokens, addSigner, removeSigner, changeRequirement } = this.props
    const { activeIndex, changeWallet, currentRequirement, currentOwners } = this.state

    const handleAddWallet = async () => {
      const addWalletAddress = document.getElementById('multisig-wallet-add-input').value

      await addMultisigWallet(addWalletAddress)

      this.setState({ activeIndex: undefined })
      document.getElementById('multisig-wallet-add-input').value = ''
    }

    const handleChangeWallet = async () => {
      const changeWalletAddress = document.getElementById('multisig-wallet-change-input').value

      await changeMultisigWallet(changeWalletAddress)

      this.setState({ activeIndex: undefined })
      document.getElementById('multisig-wallet-change-input').value = ''
    }

    const handleAddSigner = async () => {
      const newSignerAddress = document.getElementById('add-signer-address-input').value

      await addSigner(newSignerAddress, multisigWallet.address)

      this.setState({ activeIndex: undefined })
      document.getElementById('add-signer-address-input').value = ''
    }

    const handleRemoveSigner = async () => {
      const signerAddressToRemove = document.getElementById('remove-signer-address-input').value

      await removeSigner(signerAddressToRemove, multisigWallet.address)

      this.setState({ activeIndex: undefined })
      document.getElementById('remove-signer-address-input').value = ''
    }

    const handleChangeRequirement = async () => {
      const newRequirement = +document.getElementById('change-requirement-input').value

      if (newRequirement > currentOwners.length) {
        return alert('New requirement must be equal to or less than the number of current owners!') // eslint-disable-line
      }

      if (!newRequirement) {
        return alert('New requirement must be at least 1!') // eslint-disable-line
      }

      await changeRequirement(newRequirement, multisigWallet.address)

      this.setState({ activeIndex: undefined })
      document.getElementById('change-requirement-input').value = ''
    }

    const handleSendTokens = () => {
      const tokenAddress = document.getElementById('send-tokens-token-address-input').value
      const toAddress = document.getElementById('send-tokens-to-address-input').value
      const toAmount = document.getElementById('send-tokens-amount-input').value

      sendTokens(tokenAddress, toAddress, toAmount, multisigWallet.address)
    }

    return (
      <div className='multisigWalletsComponent'>
        { !loaded ? <Segment>Loading Company Multisig...</Segment>
          : multisigWallet.address
            ? <div>
              <Segment><Header as='h3'>You currently have 0 transactions awaiting confirmation</Header></Segment>
              <Header as='h4'>Company Governance Actions:</Header><br />
              <Button primary>Security Replacement</Button><br /><br />
              <Button primary>Issue New Securities</Button><br /><br />
              <Button primary>Assign Issuer</Button><br /><br />
              <br />
              <Segment>
                <Accordion>
                  <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordionClick.bind(this)}>
                    <Icon name='dropdown' />
                    Add Multisig Signer
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 0}>
                    <Label>New Signer's Address</Label>
                    <Input id='add-signer-address-input' style={{ width: '400px' }} />
                    <br />
                    <br />
                    <Button onClick={handleAddSigner} primary>Add</Button><br /><br />
                  </Accordion.Content>
                </Accordion>
              </Segment>
              <Segment>
                <Accordion>
                  <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleAccordionClick.bind(this)}>
                    <Icon name='dropdown' />
                    Remove Multisig Signer
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 1}>
                    <Label>New Signer's Address</Label>
                    <Input id='remove-signer-address-input' style={{ width: '400px' }} />
                    <br />
                    <br />
                    <Button onClick={handleRemoveSigner} primary>Remove</Button><br /><br />
                  </Accordion.Content>
                </Accordion>
              </Segment>
              <Segment>
                <Accordion>
                  <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleAccordionClick.bind(this)}>
                    <Icon name='dropdown' />
                    Change Requirement
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 2}>
                    { currentRequirement !== undefined && currentOwners !== undefined && <Header as='h6'>Wallet Currently Has { currentOwners.length } Owner{ currentOwners.length === 1 ? '' : 's' } And Requires { currentRequirement } Signatures{ currentRequirement === 1 ? '' : 's' }</Header> }
                    <Label>Number of Signatures Required for Confirmation</Label>
                    <Input id='change-requirement-input' />
                    <br />
                    <br />
                    <Button onClick={handleChangeRequirement} primary>Change</Button><br /><br />
                  </Accordion.Content>
                </Accordion>
              </Segment>
              <br />
              <Segment>
                <Accordion>
                  <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleAccordionClick.bind(this)}>
                    <Icon name='dropdown' />
                    Send Tokens
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 3}>
                    <Label>Token Address</Label>
                    <Input id='send-tokens-token-address-input' style={{ width: '400px' }} />
                    <br />
                    <Label>To Address</Label>
                    <Input id='send-tokens-to-address-input' style={{ width: '400px' }} />
                    <br />
                    <Label>Amount</Label>
                    <Input id='send-tokens-amount-input' />
                    <br />
                    <br />
                    <Button onClick={handleSendTokens} primary>Send</Button><br /><br />
                  </Accordion.Content>
                </Accordion>
              </Segment>
              <br />
              <Segment>
                { changeWallet
                  ? <div>
                    <Input id='multisig-wallet-change-input' style={{ width: '400px' }} />
                    <Button onClick={handleChangeWallet}>Change</Button>
                    <Button onClick={() => this.setState({ changeWallet: false })}>Cancel</Button>
                  </div>
                  : <div>
                    <Header as='h5'>Wallet Address { multisigWallet.address }</Header>
                    <Button onClick={() => this.setState({ changeWallet: true })}>Change</Button>
                  </div>
                }
              </Segment>
            </div>
          : <Segment>
            <Header as='h3'>Please add a wallet.</Header>
            <Input id='multisig-wallet-add-input' style={{ width: '400px' }} />
            <br />
            <br />
            <Button onClick={() => handleAddWallet()}>Add</Button>
          </Segment>
        }
      </div>
    )
  }
}

export default MultisigWalletsView
