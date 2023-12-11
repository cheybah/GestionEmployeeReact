import React from 'react';

import { Heading } from '@chakra-ui/react';

import { Page, PageContent } from '@/spa/layout';

export const PageDashboard = () => {
  return (
    <Page>
      <PageContent>
        <Heading size="md" mb="4">
          Tasks
        </Heading>
      </PageContent>
    </Page>
  );
};
