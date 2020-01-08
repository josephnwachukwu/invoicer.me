import { Injectable } from '@angular/core';

@Injectable()

// @Injectable({
//   providedIn: 'root'
// })
export class AuthConfigService {

	// App Settings
	config = {
		// App Name
		appName: 'MatchStick',
		// App Description
		appDescription: 'A Progressive Fully Functional Mobile Respnsive Web App BoilerPlate for you to start developing with angular and firebase.',
		authSettings: {
			anonymousLogin: false,
			socialLogin: true,
			gitHubLogin: false,
			googleLogin: true,
			facebookLogin: true,
			twitterLogin: false
		},
		user: {
			hasAddress: false,
			hasBillingInfo: false,
			hasSocialInfo: false,
		},
		videoHeroEnabled: true,
		footerEnabled: true,
		
	}
	

	constructor() {

	}
}
