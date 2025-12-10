import { useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import SqlLoginChallenge from '../components/challenges/SqlLoginChallenge'
import IdorChallenge from '../components/challenges/IdorChallenge'
import CookieChallenge from '../components/challenges/CookieChallenge'
import LocalStorageChallenge from '../components/challenges/LocalStorageChallenge'
import Base64Challenge from '../components/challenges/Base64Challenge'
import JsBackdoorChallenge from '../components/challenges/JsBackdoorChallenge'
import TwoPartHeistChallenge from '../components/challenges/TwoPartHeistChallenge'
import XorCryptoChallenge from '../components/challenges/XorCryptoChallenge'
import HiddenMessageChallenge from '../components/challenges/HiddenMessageChallenge'
import ChatLabChallenge from '../components/challenges/ChatLabChallenge'
import FixTheBugChallenge from '../components/challenges/FixTheBugChallenge'
import MetadataHeistChallenge from '../components/challenges/MetadataHeistChallenge'
import CipheredIncidentLogChallenge from '../components/challenges/CipheredIncidentLogChallenge'
import BreachedChatServerChallenge from '../components/challenges/BreachedChatServerChallenge'
import OperationLostCredentialsChallenge from '../components/challenges/OperationLostCredentialsChallenge'
import NotFoundPage from './NotFoundPage'

const challengeComponents = {
  'sql-login': SqlLoginChallenge,
  'idor': IdorChallenge,
  'robots-cookie': CookieChallenge,
  'localstorage-auth': LocalStorageChallenge,
  'base64-token': Base64Challenge,
  'js-backdoor': JsBackdoorChallenge,
  'two-part-heist': TwoPartHeistChallenge,
  'xor-crypto': XorCryptoChallenge,
  'hidden-message': HiddenMessageChallenge,
  'chat-lab': ChatLabChallenge,
  'fix-the-bug': FixTheBugChallenge,
  'metadata-heist': MetadataHeistChallenge,
  'ciphered-incident-log': CipheredIncidentLogChallenge,
  'breached-chat-server': BreachedChatServerChallenge,
  'operation-lost-credentials': OperationLostCredentialsChallenge,
}

export default function ChallengePage() {
  const { challengeId } = useParams()
  
  const ChallengeComponent = challengeComponents[challengeId]
  
  if (!ChallengeComponent) {
    return <NotFoundPage />
  }

  return (
    <div className="container">
      <ChallengeComponent />
    </div>
  )
}
