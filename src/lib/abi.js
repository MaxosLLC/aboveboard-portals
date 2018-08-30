import originalToken from 'lib/contracts/06-12-18/RegulatedToken'
import originalRegulatorService from 'lib/contracts/06-12-18/AboveboardRegDSWhitelistRegulatorService'
import originalSettingsStorage from 'lib/contracts/06-12-18/SettingsStorage'
import originalMultisig from 'lib/contracts/06-12-18/MultiSigArbitration'
import originalWhitelist from 'lib/contracts/06-12-18/IssuanceWhiteList'

import token from 'lib/contracts/07-11-18/RegulatedToken'
import regulatorService from 'lib/contracts/07-11-18/AboveboardRegDSWhitelistRegulatorService'
import settingsStorage from 'lib/contracts/07-11-18/SettingsStorage'
import multisig from 'lib/contracts/07-11-18/MultiSigArbitration'
import whitelist from 'lib/contracts/07-11-18/IssuanceWhiteList'

import token072618 from 'lib/contracts/07-26-18/RegulatedToken'
import regulatorService072618 from 'lib/contracts/07-26-18/RegulatorService'
import settingsStorage072618 from 'lib/contracts/07-26-18/SettingsStorage'
import multisig072618 from 'lib/contracts/07-26-18/MultiSigArbitration'
import whitelist072618 from 'lib/contracts/07-26-18/SecureIssuanceWhiteList'

const abis = {
  '06-12-18': {
    token: originalToken.abi,
    regulatorService: originalRegulatorService.abi,
    settingsStorage: originalSettingsStorage.abi,
    multisig: originalMultisig.abi,
    whitelist: originalWhitelist.abi
  },
  '07-11-18': {
    token: token.abi,
    regulatorService: regulatorService.abi,
    settingsStorage: settingsStorage.abi,
    multisig: multisig.abi,
    whitelist: whitelist.abi
  },
  '07-26-18': {
    token: token072618.abi,
    regulatorService: regulatorService072618.abi,
    settingsStorage: settingsStorage072618.abi,
    multisig: multisig072618.abi,
    whitelist: whitelist072618.abi
  }
}

const bins = {
  '07-26-18': {
    token: token072618.bytecode,
    regulatorService: regulatorService072618.bytecode,
    settingsStorage: settingsStorage072618.bytecode,
    multisig: multisig072618.bytecode,
    whitelist: whitelist072618.bytecode
  }
}

export const getAbi = (contractType, version = '07-26-18') => {
  return abis[version][contractType]
}

export const getBin = (contractType, version = '07-26-18') => {
  return bins[version][contractType]
}
