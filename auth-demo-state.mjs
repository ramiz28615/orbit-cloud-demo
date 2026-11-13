export function shouldAutoUseLiveSession(user, userSelectedDemo) {
  return Boolean(
    user &&
    !userSelectedDemo &&
    user.emailVerified === true &&
    Array.isArray(user.providerData) &&
    user.providerData.some((provider) => provider.providerId === 'google.com') &&
    typeof user.getIdToken === 'function'
  );
}
