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
import regulatorService072618 from 'lib/contracts/07-26-18/AboveboardRegDSWhitelistRegulatorService'
import settingsStorage072618 from 'lib/contracts/07-26-18/SettingsStorage'
import serviceRegistry072618 from 'lib/contracts/07-26-18/ServiceRegistry'
import multisig072618 from 'lib/contracts/07-26-18/MultiSigArbitration'
import whitelist072618 from 'lib/contracts/07-26-18/IssuanceWhiteList'
import secureWhitelist072618 from 'lib/contracts/07-26-18/SecureIssuanceWhiteList'

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
    serviceRegistry: serviceRegistry072618.abi,
    multisig: multisig072618.abi,
    whitelist: whitelist072618.abi,
    secureWhitelist: secureWhitelist072618.abi
  },
  '08-29-18': {
    token: token082918.abi,
    regulatorService: regulatorService082918.abi,
    settingsStorage: settingsStorage082918.abi,
    serviceRegistry: serviceRegistry082918.abi,
    multisig: multisig082918.abi,
    whitelist: whitelist082918.abi,
    secureWhitelist: secureWhitelist082918.abi
  }
}

const bins = {
  '07-26-18': {
    token: token072618.bytecode,
    regulatorService: regulatorService072618.bytecode,
    settingsStorage: settingsStorage072618.bytecode,
    serviceRegistry: serviceRegistry072618.bytecode,
    multisig: multisig072618.bytecode,
    whitelist: whitelist072618.bytecode,
    secureWhitelist: secureWhitelist072618.bytecode
  },
  '08-29-18': {
    token: token082918.bytecode,
    regulatorService: regulatorService082918.bytecode,
    settingsStorage: settingsStorage082918.bytecode,
    serviceRegistry: serviceRegistry082918.bytecode,
    multisig: multisig082918.bytecode,
    whitelist: whitelist082918.bytecode,
    secureWhitelist: secureWhitelist082918.bytecode
  }
}

export const getAbi = (contractType, version = '08-29-18') => {
  return abis[version][contractType]
}

export const getBin = (contractType, version = '08-29-18') => {
  return bins[version][contractType]
}
