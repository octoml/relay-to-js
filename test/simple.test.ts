import {fromtvm, GraphData} from '../src';

describe('simple relay translation', () => {
  it('translates a simple serialized graph layout to a structured object', () => {
    const data: GraphData = {
      root: 1,
      nodes: [
        {
          type_key: '',
        },
        {
          type_key: 'relay.Function',
          attrs: {
            _checked_type_: '9',
            attrs: '0',
            body: '3',
            params: '2',
            ret_type: '6',
            span: '0',
            type_params: '8',
          },
        },
        {
          type_key: 'Array',
        },
        {
          type_key: 'relay.Constant',
          attrs: {
            _checked_type_: '6',
            data: '0',
            span: '4',
          },
        },
        {
          type_key: 'Span',
          attrs: {
            column: '4',
            end_column: '5',
            end_line: '3',
            line: '3',
            source_name: '5',
          },
        },
        {
          type_key: 'SourceName',
          repr_str: 'from_string',
        },
        {
          type_key: 'relay.TensorType',
          attrs: {
            dtype: 'int32',
            shape: '7',
            span: '0',
          },
        },
        {
          type_key: 'Array',
        },
        {
          type_key: 'Array',
        },
        {
          type_key: 'FuncType',
          attrs: {
            arg_types: '10',
            ret_type: '6',
            span: '0',
            type_constraints: '12',
            type_params: '11',
          },
        },
        {
          type_key: 'Array',
        },
        {
          type_key: 'Array',
        },
        {
          type_key: 'Array',
        },
      ],
      b64ndarrays: [
        'P6G0lvBAXt0AAAAAAAAAAAEAAAAAAAAAAAAAAAAgAQAEAAAAAAAAAAMAAAA=',
      ],
      attrs: {tvm_version: '0.7.dev1'},
    };

    expect(fromtvm(data.nodes, data.root).rootNode).toEqual({
      id: 1,
      type_key: 'relay.Function',
      attrs: {
        _checked_type_: {
          id: 9,
          type_key: 'FuncType',
          attrs: {
            arg_types: {id: 10, type_key: 'Array'},
            ret_type: {
              id: 6,
              type_key: 'relay.TensorType',
              attrs: {dtype: 'int32', shape: {id: 7, type_key: 'Array'}},
            },
            type_constraints: {id: 12, type_key: 'Array'},
            type_params: {id: 11, type_key: 'Array'},
          },
        },
        attrs: {type_key: '', id: 0},
        body: {
          id: 3,
          type_key: 'relay.Constant',
          attrs: {
            _checked_type_: {
              id: 6,
              type_key: 'relay.TensorType',
              attrs: {dtype: 'int32', shape: {id: 7, type_key: 'Array'}},
            },
            data: '0',
            span: {
              id: 4,
              type_key: 'Span',
              attrs: {
                column: '4',
                end_column: '5',
                end_line: '3',
                line: '3',
                source_name: {
                  id: 5,
                  type_key: 'SourceName',
                  repr_str: 'from_string',
                },
              },
            },
          },
        },
        params: {id: 2, type_key: 'Array'},
        ret_type: {
          id: 6,
          type_key: 'relay.TensorType',
          attrs: {dtype: 'int32', shape: {id: 7, type_key: 'Array'}},
        },
        type_params: {id: 8, type_key: 'Array'},
      },
    });
  });
});
