import React, { Component } from 'react'
import { sortBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { Grid, Icon, Container } from 'semantic-ui-react'
import Button from 'components/inputs/button/Button'
import './Tokens.css'

class TokensView extends Component {
  render () {
    const { loaded, tokens, watchingTokens, routeTo } = this.props

    const handleRowClick = tokenAddress => {
      routeTo(`/tokens/${tokenAddress}/detail`)
    }

    const filteredWatchingTokens = tokens.filter(token => {
      return watchingTokens.some(watchedToken => token.address === watchedToken.address)
    })

    return (
      <Container className='tokensComponent'>

        { !loaded ? <span>Loading tokens...<Icon name='spinner' loading /></span>
          : filteredWatchingTokens.length
            ? <div>
              <div className='add-token'>
                <Button type='submit' color='teal'>Add Token</Button>
              </div>
              <div className='title'>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column className='token' width={6}>Token</Grid.Column>
                    <Grid.Column width={10}>Contract Address</Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
              <div className='content'>
                { sortBy('name', filteredWatchingTokens).map(token =>
                  <Grid className='content' columns={2} key={token.address} onClick={() => handleRowClick(token.address)} style={{ cursor: 'pointer' }}>
                    <Grid.Row>
                      <Grid.Column className='token' width={6}>{token.name}</Grid.Column>
                      <Grid.Column className='address' width={10}>
                        <div>{token.address}</div>
                        <div>
                          <Icon name='external' />
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  ) }
              </div>
            </div>
            : <span>You are currently not watching any tokens. Please visit your <Link to='/settings'>settings</Link> to start watching tokens.</span>
        }
      </Container>
    )
  }
}

export default TokensView
