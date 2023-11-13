import React from 'react';

export function dataset(
  title: string,
  ds: string,
  ds_key: number,
  name: string,
  definition: string,
  parameter_no: number
): any {
  return {
    __typename: 'db_tdms_data_set',
    data_set_title: {
      __typename: 'db_tdms_data_set_title',
      title,
    },
    ds: ds,
    data_set_parameters: [
      {
        parameter: {
          __typename: 'db_tdms_parameters',
          name,
          definition,
        },
        __typename: 'db_tdms_data_set_parameter',
        parameter_no,
      },
    ],
  };
}

test.skip('', () => {});

/**
 export function basicDtnListTestMocks(dtnModCategories?: DtnModCategories, transferComponent?: TransferComponent) {
  return [
    {
      request: {
        query: LIST_DTN_BY_CATEGORY_QUERY,
        variables: {
          modcat: dtnModCategories,
          transfer: transferComponent,
        },
      },
      result: {
        data: {
          db_tdms_data_set: [
            dataset('1', 'a', 101, '11', 'zz', 11),
            dataset('2', 'b', 102, '22', 'bb', 22),
            dataset('3', 'c', 103, '33', 'cc', 33),
            dataset('4', 'd', 104, '44', 'dd', 44),
            dataset('5', 'e', 105, '55', 'ee', 55),
            dataset('6', 'f', 106, '66', 'ff', 66),
            dataset('7', 'g', 107, '77', 'gg', 77),
            dataset('8', 'h', 108, '88', 'hh', 88),
            dataset('9', 'i', 109, '99', 'ii', 99),
            dataset('10', 'j', 100, '1010', 'jj', 1010),
          ],
        },
      },
    },
    {
      request: {
        query: LIST_DTN_BY_CATEGORY_QUERY,
        variables: {
          modcat: dtnModCategories,
          transfer: transferComponent,
        },
      },
      result: {
        data: {
          db_tdms_data_set: [dataset('11', 'k', 111, '1011', 'kk', 111), dataset('12', 'l', 112, '12', 'll', 112)],
        },
      },
    },
  ];
}

 export async function basicDtnListTest(wrapper: ReactWrapper) {
  await act(async () => {
    await wait(0);
  });
  await act(async () => {
    const afterUpdate = wrapper.update();
    expect(afterUpdate.exists(List)).toBeTruthy();
    const listElement = afterUpdate.find(List);
    const textElements = listElement.find(Text);
    const textElementAssertions: [number, string][] = [
      [0, 'DTN'],
      [1, 'Data File'],
      [2, 'Data Set Title'],
      [3, 'Parameter Name'],
    ];
    textElementAssertions.forEach(([index, string]) => {
      expect(textElements.at(index).contains(string)).toBeTruthy();
    });
    const linkElements = listElement.find(Link);
    const linkElementAssertions: [number, string][] = [
      [0, 'a'],
      [1, '1'],
      [2, 'b'],
      [3, '2'],
      [4, 'c'],
      [5, '3'],
    ];
    linkElementAssertions.forEach(([index, string]) => {
      expect(linkElements.at(index).contains(string)).toBeTruthy();
    });
  });
}

 test.skip('When passing a ds filter only the matching data_set should be returned', async () => {
  const mocks = [
    {
      request: {
        query: LIST_DTN_BY_CATEGORY_QUERY,
        variables: {
          ds: 'a',
        },
      },
      result: {
        data: {
          db_tdms_data_set: [dataset('1', 'a', 101, '11', 'aa', 101)],
        },
      },
    },
  ];

  const wrapper = mount(
    <MockedProvider mocks={mocks} addTypename={true}>
      <MemoryRouter timeout={0}>
        <ListDtnByCategory ds={'a'} />
      </MemoryRouter>
    </MockedProvider>
  );

  await act(async () => {
    await wait(0);
  });
  await act(async () => {
    const afterUpdate = wrapper.update();
    expect(afterUpdate.exists(List)).toBeTruthy();
    const listElement = afterUpdate.find(List);
    const textElements = listElement.find(Text);
    const textElementAssertions: [number, string][] = [
      [0, 'DTN'],
      [1, 'Data File'],
      [2, 'Data Set Title'],
      [3, 'Parameter Name'],
    ];
    textElementAssertions.forEach(([index, string]) => {
      expect(textElements.at(index).contains(string)).toBeTruthy();
    });
    const linkElements = listElement.find(Link);
    const linkElementAssertions: [number, string][] = [
      [0, 'a'],
      [1, '1'],
    ];
    linkElementAssertions.forEach(([index, string]) => {
      expect(linkElements.at(index).contains(string)).toBeTruthy();
    });
  });
});

 test.skip('When rendering a paginated grid and no need to paginate then the table should render all items', async () => {
  const wrapper = mount(
    <MockedProvider
      cache={
        new InMemoryCache({
          addTypename: true,
          fragmentMatcher: { match: () => true },
        })
      }
      mocks={basicDtnListTestMocks(DtnModCategories.nye, TransferComponent.SPA)}
      addTypename={true}
    >
      <MemoryRouter timeout={0}>
        <CountyData />
      </MemoryRouter>
    </MockedProvider>
  );
  await basicDtnListTest(wrapper);
});

 test.skip('When rendering a paginated grid and there is a need to paginate then that paginated data should show.', async () => {
  const wrapper = mount(
    <MockedProvider mocks={basicDtnListTestMocks(DtnModCategories.bio, TransferComponent.MWD)} addTypename={true}>
      <MemoryRouter timeout={0}>
        <ListDtnByCategory transfer={TransferComponent.MWD} dtnCategory={DtnModCategories.bio} />
      </MemoryRouter>
    </MockedProvider>
  );
  await act(async () => {
    await wait(5);
  });
  await act(async () => {
    await wait(5);
    const items = wrapper.update().find(ListDtnByCategory).find(List).props().items as ListDtnByCategoryData[];
    const assertions: [string, string][] = [
      ['1', 'a'],
      ['2', 'b'],
      ['3', 'c'],
      ['4', 'd'],
      ['5', 'e'],
      ['6', 'f'],
      ['7', 'g'],
      ['8', 'h'],
      ['9', 'i'],
      ['10', 'j'],
      ['11', 'k'],
      ['12', 'l'],
    ];
    assertions.forEach(([ds, title], index) => {
      const item = items[index];
      expect(item.ds).toBe(title);
      expect(item.data_set_title?.title).toBe(ds);
    });
  });
});

 test.skip('When rendering a paginated grid and there is no data then show no data message.', async () => {
  const wrapper = mount(
    <MockedProvider
      mocks={[
        {
          request: {
            query: LIST_DTN_BY_CATEGORY_QUERY,
            variables: {
              modcat: DtnModCategories.nye,
              transfer: TransferComponent.SPA,
            },
          },
          result: {
            data: {
              db_tdms_data_set: [],
            },
          },
        },
      ]}
      cache={
        new InMemoryCache({
          addTypename: true,
          fragmentMatcher: { match: () => true },
        })
      }
      addTypename={true}
    >
      <MemoryRouter timeout={0}>
        <ListDtnByCategory dtnCategory={DtnModCategories.nye} transfer={TransferComponent.SPA} />
      </MemoryRouter>
    </MockedProvider>
  );
  await act(async () => {
    await wait(5);
  });
  await act(async () => {
    await wait(5);
    expect(wrapper.update().find(ListDtnByCategory).exists('NoData')).toBeTruthy();
  });
});
 */
