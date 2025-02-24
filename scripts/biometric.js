// Utility functions for converting between strings and Uint8Array
function stringToUint8Array(str) {
    return Uint8Array.from(str, c => c.charCodeAt(0));
  }
  
  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  
  // Function to register a new biometric credential using face recognition
  export async function registerBiometric() {
    // In production, get a random challenge and proper user ID from your server.
    const publicKeyOptions = {
      challenge: stringToUint8Array("dummyChallengeForRegistration"),
      rp: {
        name: "Habit Tracker",
        id: window.location.hostname
      },
      user: {
        // In production, use a secure, unique user ID (as a Uint8Array)
        id: stringToUint8Array("uniqueUserId"),
        name: "user@example.com",
        displayName: "Example User"
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 } // ES256
      ],
      timeout: 60000,
      authenticatorSelection: {
        authenticatorAttachment: "platform", // forces use of built-in authenticators (e.g., face recognition)
        userVerification: "required"
      },
      attestation: "direct"
    };
  
    try {
      const credential = await navigator.credentials.create({ publicKey: publicKeyOptions });
      console.log("Biometric registration successful.");
      console.log("Credential:", credential);
      // In production, send the credential to your backend for verification and storage.
    } catch (err) {
      console.error("Error during biometric registration:", err);
    }
  }
  
  // Function to authenticate a user using biometrics (face recognition)
  export async function authenticateBiometric() {
    // In production, fetch a fresh challenge and allowed credentials from your backend.
    const publicKeyOptions = {
      challenge: stringToUint8Array("dummyChallengeForAuthentication"),
      timeout: 60000,
      // allowCredentials should be an array of credential descriptors registered for the user.
      // For demonstration, we'll leave it empty to allow any credential.
      userVerification: "required"
    };
  
    try {
      const assertion = await navigator.credentials.get({ publicKey: publicKeyOptions });
      console.log("Biometric authentication successful.");
      console.log("Assertion:", assertion);
      // In production, send the assertion to your server for verification.
      // For demonstration, we assume success.
      return true;
    } catch (err) {
      console.error("Error during biometric authentication:", err);
      return false;
    }
  }
  