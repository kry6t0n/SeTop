export {
  getConnectionStyle,
  getNetworkAddress,
  areIPsCompatible,
  canConnectNodes,
  validateConnections,
  getSuggestedConnectionType,
  getEdgeInfo,
  CONNECTION_TYPES
} from '@my-app/ui-library'

// This file delegates connection logic to the shared ui-library implementation.
// Tests in the frontend expect a local module at ./connectionLogic, so we re-export
// the implementations from the ui-library package for compatibility.
