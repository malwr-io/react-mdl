/* eslint-env mocha */
import expect from 'expect';
import React from 'react';
import { render, renderDOM } from './render';
import ReactDOM from 'react-dom';
import Textfield from '../src/Textfield';

describe('Textfield', () => {
    it('should render an div with the textfield css classes', () => {
        var output = render(<Textfield label="label" />);

        expect(output.type).toBe('div');
        expect(output.props.className)
            .toInclude('mdl-textfield')
            .toInclude('mdl-js-textfield');
    });

    it('should allow custom css classes', () => {
        var output = render(<Textfield className="my-textfield" label="label" />);

        expect(output.props.className).toInclude('my-textfield');
    });

    it('should render an input by default', () => {
        var output = render(<Textfield label="label" />);

        var input = output.props.children[1][0];
        expect(input.type).toBe('input');
    });

    describe('should render a textarea', () => {
        it('when rows is specified', () => {
            var output = render(<Textfield label="label" rows={3} />);

            var input = output.props.children[1][0];
            expect(input.type).toBe('textarea');
        });

        it('when maxRows is specified', () => {
            var output = render(<Textfield label="label" maxRows={5} />);

            var input = output.props.children[1][0];
            expect(input.type).toBe('textarea');
        });
    });

    it('should render with a floating label', () => {
        var output = render(<Textfield label="label" floatingLabel />);

        expect(output.props.className)
            .toInclude('mdl-textfield--floating-label');
    });

    it('should not render any error message by default', () => {
        var output = render(<Textfield label="label" />);

        expect(output.props.children[1][2]).toBe(null);
    });

    it('should render with an error message if specified', () => {
        var output = render(<Textfield label="label" error="error..." />);

        expect(output.props.children[1][2].props.className)
            .toInclude('mdl-textfield__error');
        expect(output.props.children[1][2].props.children).toBe('error...');
    });

    it('should render an expandable textfield if specified', () => {
        var output = render(<Textfield label="label" expandable expandableIcon="search" />);

        expect(output.props.className)
            .toInclude('mdl-textfield--expandable');

        var expandableLabel = output.props.children[0];
        expect(expandableLabel.props.className)
            .toInclude('mdl-button')
            .toInclude('mdl-js-button ')
            .toInclude('mdl-button--icon');
        var expandableIcon = expandableLabel.props.children;
        expect(expandableIcon.props.className).toInclude('material-icons');
        expect(expandableIcon.props.children).toBe('search');

        var inputContainer = output.props.children[1];
        expect(inputContainer.type).toBe('div');
        expect(inputContainer.props.className)
            .toInclude('mdl-textfield__expandable-holder');
        expect(inputContainer.props.children[0].type).toBe('input');
    });

    describe('should update the textfield after the first render', () => {
        it('when it receives an error', () => {
            var el = renderDOM(<Textfield label="label" />);

            ReactDOM.render(<Textfield label="label" error="is now invalid!" />, el.parentNode);

            expect(el.className).toInclude('is-invalid');
        });

        it('when it receives a new value', () => {
            var el = renderDOM(<Textfield label="label" />);

            ReactDOM.render(<Textfield label="label" value="my value" />, el.parentNode);

            expect(el.querySelector('.mdl-textfield__input').value).toBe('my value');
        });

        it('when it gets disabled', () => {
            var el = renderDOM(<Textfield label="label" />);

            ReactDOM.render(<Textfield label="label" disabled />, el.parentNode);

            expect(el.className).toInclude('is-disabled');
            expect(el.querySelector('.mdl-textfield__input').disabled).toBe(true);
        });

        it('when it gets required w/o value', () => {
            var el = renderDOM(<Textfield label="label" />);

            ReactDOM.render(<Textfield label="label" required />, el.parentNode);

            expect(el.className).toInclude('is-invalid');
            expect(el.querySelector('.mdl-textfield__input').required).toBe(true);
        });

        it('when it gets required with value', () => {
            var el = renderDOM(<Textfield label="label" value="my value" onChange={() => null} />);

            ReactDOM.render(<Textfield label="label" value="my value"  onChange={() => null} required />, el.parentNode);

            expect(el.className).toExclude('is-invalid');
            expect(el.querySelector('.mdl-textfield__input').required).toBe(true);
        });

        it('when it receives a pattern with an incorrect value', () => {
            var el = renderDOM(<Textfield label="label" value="value" onChange={() => null} />);

            ReactDOM.render(<Textfield label="label" value="value" onChange={() => null} pattern="[0-9]+" />, el.parentNode);

            expect(el.className).toInclude('is-invalid');
        });

        it('when it receives a pattern with correct value', () => {
            var el = renderDOM(<Textfield label="label" value="17" onChange={() => null} />);

            ReactDOM.render(<Textfield label="label" value="17" onChange={() => null} pattern="[0-9]+" />, el.parentNode);

            expect(el.className).toExclude('is-invalid');
        });
    });
});
