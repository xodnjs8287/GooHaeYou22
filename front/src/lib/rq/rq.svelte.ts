import { goto } from '$app/navigation';

import type { paths } from '$lib/types/api/v1/schema';
import createClient from 'openapi-fetch';
import type { components } from '$lib/types/api/v1/schema';

class Rq {
	public member: components['schemas']['MemberDto'];

	constructor() {
		this.member = this.makeReactivityMember();
	}

	// URL
	public goTo(url: string) {
		goto(url);
	}

	public replace(url: string) {
		goto(url, { replaceState: true });
	}

	// 인증
	// member 의 값이 바뀌면, member 를 사용하는 모든 곳에서 자동으로 즉각 반영된다.
	public makeReactivityMember() {
		let id = $state(0); // 로그아웃 상태
		let username = $state('');
		let gender = $state('UNDEFINED');
		let location = $state('');
		let birth = $state('');

		return {
			get id() {
				return id;
			},
			set id(value: number) {
				id = value;
			},
			get username() {
				return username;
			},
			set gender(value) {
				gender = value;
			},
			get location() {
				return location;
			},
			set location(value: string) {
				location = value;
			},
			get birth() {
				return birth;
			},
			set birth(value: string) {
				birth = value;
			}
		};
	}

	// API END POINTS
	public apiEndPoints() {
		return createClient<paths>({
			baseUrl: import.meta.env.VITE_CORE_API_BASE_URL,
			credentials: 'include'
		});
	}

	// MSG, REDIRECT
	public msgAndRedirect(
		data: { msg: string } | undefined,
		error: { msg: string } | undefined,
		url: string,
		callback?: () => void
	) {
		if (data) this.msgInfo(data.msg);
		if (error) this.msgError(error.msg);

		this.replace(url);

		if (callback) window.setTimeout(callback, 100);
	}

	public msgInfo(msg: string) {
		window.alert(msg);
	}

	public msgError(msg: string) {
		window.alert(msg);
	}

	public setLogined(member: components['schemas']['MemberDto']) {
		Object.assign(this.member, member);
	}

	public setLogout() {
		this.member.id = 0;
		this.member.username = '';
		this.member.gender = 'UNDEFINED';
		this.member.location = '';
		this.member.birth = '';
	}

	public isLogin() {
		return this.member.id !== 0;
	}

	public isLogout() {
		return !this.isLogin();
	}

	public async initAuth() {
		const { data } = await this.apiEndPoints().GET('/api/member/me');

		if (data) {
			this.setLogined(data.data); // MemberDto 넘기기
		}
	}

	public async logoutAndRedirect(url: string) {
		//await this.apiEndPoints().POST('/api/member/logout');

		this.setLogout();
		this.replace(url);
	}
}

const rq = new Rq();

export default rq;
