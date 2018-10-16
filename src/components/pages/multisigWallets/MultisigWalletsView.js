import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Button, Header, Icon, Image, Input, Label, Segment } from 'semantic-ui-react'

class MultisigWalletsView extends Component {
  constructor (props) {
    super(props)
    this.state = { changeWallet: false }
  }

  async componentDidMount () {
    await this.props.loadMultisigWallet()

    if (this.props.multisigWallet && this.props.multisigWallet.address) {
      try {
        const currentRequirement = await this.props.getCurrentRequirement(this.props.multisigWallet.address)
        const currentOwners = await this.props.getOwners(this.props.multisigWallet.address)

        this.setState({ currentOwners, currentRequirement })
      } catch (e) {
        console.log(`Could not load company multisig wallet: ${e.message || e}`)
      }
    }
  }

  handleAccordionClick (e, titleProps) {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render () {
    const { loaded, connected, multisigWallet, addMultisigWallet, changeMultisigWallet, addSigner, removeSigner, changeRequirement } = this.props
    const { activeIndex, changeWallet, currentRequirement, currentOwners } = this.state

    const handleAddWallet = async () => {
      const addWalletAddress = document.getElementById('multisig-wallet-add-input').value

      await addMultisigWallet(addWalletAddress)

      this.setState({ activeIndex: undefined })
    }

    const handleChangeWallet = async () => {
      const changeWalletAddress = document.getElementById('multisig-wallet-change-input').value

      await changeMultisigWallet(changeWalletAddress)

      document.getElementById('multisig-wallet-change-input').value = ''
      this.setState({ activeIndex: undefined, changeWallet: false })
    }

    const handleAddSigner = async () => {
      const newSignerAddress = document.getElementById('add-signer-address-input').value

      await addSigner(newSignerAddress, multisigWallet.address)

      document.getElementById('add-signer-address-input').value = ''
      this.setState({ activeIndex: undefined })
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

      document.getElementById('change-requirement-input').value = ''
      this.setState({ activeIndex: undefined })
    }

    return (
      <div className='multisigWalletsComponent'>
        { !connected ? <Segment>Please connect your <Link to='/wallet'>wallet</Link>.</Segment>
          : !loaded ? <Segment>Loading Company Multisig...</Segment>
          : multisigWallet.address
            ? <div>
              <Segment><Header as='h3'>You currently have 0 transactions awaiting confirmation</Header></Segment>
              <Header as='h4'>Governance Actions:</Header>
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
            <Header as='h3'>Deploy a new multi-signature wallet</Header>
            <a href={'https://github.com/MaxosLLC/AboveboardSecurityToken/blob/master/contracts/MultiSigArbitration.sol'} target='_blank' rel='noopener noreferrer'>View the Source Code</a>
            <br /><br />
            <Button onClick={() => {}}>Deploy</Button>
            <br />
            <Header as='h4'>or</Header>
            <Header as='h3'>Add an existing wallet</Header>
            <Input id='multisig-wallet-add-input' style={{ width: '40%' }} />
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
