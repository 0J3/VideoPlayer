// Created by 0J3#0001
// Copyright (c) 2021

// feel free to yoink this - i made this as project-independent as i could, but you'll sadly only have typescript docs + a few comments to use if you yoink this
// just credit me ok plz ty

// USAGE: You import the ToastMgr and the Toast exports, and insert one Toast in the closest-to-root location possible
//        Each toast has an ID property, which is mandatory, and will
//        You run ToastMgr.ShowToast(Text) to show the toast

import { Component, h } from 'preact';

const Toasts: any = {};

export class Toast extends Component<
	{
		id: string;
		class?: string;
	},
	{
		show?: boolean;
		text?: string;
	}
> {
	tout: any;
	showStuff(text: string) {
		this.setState({
			show: true,
			text,
		});
		this.forceUpdate();
		if (this.tout) clearTimeout(this.tout);
		this.tout = setTimeout(() => {
			this.setState({
				show: false,
				text,
			});
			this.forceUpdate();
		}, 4e3);
	}
	componentWillMount() {
		this.setState({
			show: false,
		});
	}
	render() {
		Toasts[this.props.id] = this;
		return (
			<div
				className="ToastContainer J3PlayerToastContainer"
				style={{
					position: 'fixed',
					left: '50vw',
					bottom: '10vh',
					transform: 'translate(-50%,-50%)',
					zIndex: 69420,
				}}
			>
				<div
					className={'Toast ' + this.props.class}
					style={{
						opacity: this.state.show ? 0.5 : 0,
						transition: 'opacity 1s, top 1s',
						padding: '16px 16px',
						minWidth: '250px',
						background: '#333',
						color: '#fff',
						textAlign: 'center',
						borderRadius: '5px',
						position: 'relative',
						transform: 'translate(0,-50%)',
						top: this.state.show ? '0' : '15px',
					}}
				>
					{this.state.text}
				</div>
			</div>
		);
	}
}
export const ToastMgr = {
	Show: (s: string, text: string) => {
		if (!Toasts[s]) throw new Error('Invalid Id');

		Toasts[s].showStuff(text);
	},
};
export default ToastMgr;
