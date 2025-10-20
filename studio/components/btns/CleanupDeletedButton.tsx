import React, {useState} from 'react';
import {Button, Card, Stack, Text, Box} from '@sanity/ui';
import {TrashIcon} from '@sanity/icons';
import {useClient} from 'sanity';

interface DeleteResult {
  type: 'product' | 'collection';
  id: string;
  title: string;
  success: boolean;
  error?: string;
}

export const CleanupDeletedButton = () => {
  const client = useClient({apiVersion: '2024-01-01'});
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<{
    productsDeleted: number;
    collectionsDeleted: number;
    errors: string[];
  } | null>(null);

  const handleCleanup = async () => {
    if (isRunning) return;

    setIsRunning(true);

    try {
      console.log('🔍 Starting cleanup of deleted Shopify documents...');

      const results: DeleteResult[] = [];
      const errors: string[] = [];

      // Find all products marked as deleted in Shopify
      const deletedProducts = await client.fetch<
        Array<{_id: string; title: string}>
      >(
        `*[_type == "product" && store.isDeleted == true] { _id, "title": store.title }`,
      );

      console.log(`Found ${deletedProducts.length} deleted products`);
      console.log(deletedProducts);

      // Find all collections marked as deleted in Shopify
      const deletedCollections = await client.fetch<
        Array<{_id: string; title: string}>
      >(
        `*[_type == "collection" && store.isDeleted == true] { _id, "title": store.title }`,
      );

      console.log(deletedCollections);

      console.log(`Found ${deletedCollections.length} deleted collections`);

      //   // Delete products
      //   for (const product of deletedProducts) {
      //     try {
      //       await client.delete(product._id)
      //       results.push({
      //         type: 'product',
      //         id: product._id,
      //         title: product.title || 'Unknown',
      //         success: true,
      //       })
      //       console.log(`✅ Deleted product: ${product.title} (${product._id})`)
      //     } catch (error) {
      //       const errorMsg = `Failed to delete product ${product.title}: ${error}`
      //       errors.push(errorMsg)
      //       results.push({
      //         type: 'product',
      //         id: product._id,
      //         title: product.title || 'Unknown',
      //         success: false,
      //         error: error instanceof Error ? error.message : 'Unknown error',
      //       })
      //       console.error(`❌ ${errorMsg}`)
      //     }
      //   }

      const BATCH_SIZE = 50;

      for (let i = 0; i < deletedProducts.length; i += BATCH_SIZE) {
        const batch = deletedProducts.slice(i, i + BATCH_SIZE);

        await Promise.allSettled(
          batch.map(async (product) => {
            try {
              await client.delete(product._id);
              results.push({
                type: 'product',
                id: product._id,
                title: product.title || 'Unknown',
                success: true,
              });
              console.log(
                `✅ Deleted product: ${product.title} (${product._id})`,
              );
            } catch (error) {
              const errorMsg = `Failed to delete product ${product.title}: ${error}`;
              errors.push(errorMsg);
              results.push({
                type: 'product',
                id: product._id,
                title: product.title || 'Unknown',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              console.error(`❌ ${errorMsg}`);
            }
          }),
        );
      }

      // Delete collections
      for (const collection of deletedCollections) {
        try {
          await client.delete(collection._id);
          results.push({
            type: 'collection',
            id: collection._id,
            title: collection.title || 'Unknown',
            success: true,
          });
          console.log(
            `✅ Deleted collection: ${collection.title} (${collection._id})`,
          );
        } catch (error) {
          const errorMsg = `Failed to delete collection ${collection.title}: ${error}`;
          errors.push(errorMsg);
          results.push({
            type: 'collection',
            id: collection._id,
            title: collection.title || 'Unknown',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          console.error(`❌ ${errorMsg}`);
        }
      }

      const productsDeleted = results.filter(
        (r) => r.type === 'product' && r.success,
      ).length;
      const collectionsDeleted = results.filter(
        (r) => r.type === 'collection' && r.success,
      ).length;

      setLastRun({
        productsDeleted,
        collectionsDeleted,
        errors,
      });

      console.log(
        `✨ Cleanup complete: ${productsDeleted} products, ${collectionsDeleted} collections deleted`,
      );

      alert(
        `Cleanup complete!\n\n` +
          `Products deleted: ${productsDeleted}\n` +
          `Collections deleted: ${collectionsDeleted}\n` +
          (errors.length > 0 ? `\nErrors: ${errors.length}` : ''),
      );
    } catch (error) {
      console.error('💥 Fatal error during cleanup:', error);
      alert(
        `Error during cleanup: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card padding={4} radius={2} shadow={1} tone="caution">
      <Stack space={3}>
        <Text weight="semibold" size={2}>
          Cleanup Deleted Shopify Documents
        </Text>
        <Text size={1} muted>
          This will permanently delete all products and collections that are
          marked as deleted in Shopify.
        </Text>

        <Box>
          <Button
            text={isRunning ? 'Running cleanup...' : 'Run Cleanup'}
            tone="critical"
            icon={TrashIcon}
            onClick={handleCleanup}
            disabled={isRunning}
            loading={isRunning}
          />
        </Box>

        {lastRun && (
          <Card padding={3} radius={2} tone="positive" border>
            <Stack space={2}>
              <Text size={1}>Products deleted: {lastRun.productsDeleted}</Text>
              <Text size={1}>
                Collections deleted: {lastRun.collectionsDeleted}
              </Text>
              {lastRun.errors.length > 0 && (
                <Text size={1}>Errors: {lastRun.errors.length}</Text>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
};
