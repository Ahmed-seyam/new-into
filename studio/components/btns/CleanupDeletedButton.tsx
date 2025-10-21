import React, {useState} from 'react';
import {Button, Card, Stack, Text, Box} from '@sanity/ui';
import {TrashIcon} from '@sanity/icons';
import {useClient} from 'sanity';

interface DeleteResult {
  type: 'product' | 'collection' | 'productVariant';
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
    variantsDeleted: number;
    unavailableVariantsDeleted: number;
    errors: string[];
  } | null>(null);

  const handleCleanup = async () => {
    if (isRunning) return;

    const confirmed = window.confirm(
      'This will permanently delete:\n\n' +
        '• Products marked as deleted in Shopify\n' +
        '• Collections marked as deleted in Shopify\n' +
        '• Product variants marked as deleted in Shopify\n' +
        '• Product variants where inventory is not available\n\n' +
        'Are you sure?'
    );

    if (!confirmed) return;

    setIsRunning(true);

    try {
      console.log('🔍 Starting cleanup of deleted Shopify documents...');

      const results: DeleteResult[] = [];
      const errors: string[] = [];
      const BATCH_SIZE = 50;

      // ============================================
      // STEP 1: Delete Products
      // ============================================
      console.log('Step 1: Fetching deleted products...');
      const deletedProducts = await client.fetch<
        Array<{_id: string; title: string}>
      >(
        `*[_type == "product" && store.isDeleted == true] { _id, "title": store.title }`,
      );

      console.log(`Found ${deletedProducts.length} deleted products`);

      if (deletedProducts.length > 0) {
        console.log('Deleting products...');
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
                console.error(` ${errorMsg}`);
              }
            }),
          );
        }
        console.log('Products cleanup complete');
      }

      // ============================================
      // STEP 2: Delete Collections
      // ============================================
      console.log('Step 2: Fetching deleted collections...');
      const deletedCollections = await client.fetch<
        Array<{_id: string; title: string}>
      >(
        `*[_type == "collection" && store.isDeleted == true] { _id, "title": store.title }`,
      );

      console.log(`Found ${deletedCollections.length} deleted collections`);

      if (deletedCollections.length > 0) {
        console.log('Deleting collections...');
        for (let i = 0; i < deletedCollections.length; i += BATCH_SIZE) {
          const batch = deletedCollections.slice(i, i + BATCH_SIZE);

          await Promise.allSettled(
            batch.map(async (collection) => {
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
                console.error(` ${errorMsg}`);
              }
            }),
          );
        }
        console.log('Collections cleanup complete');
      }

      // ============================================
      // STEP 3: Delete Product Variants (Deleted)
      // ============================================
      console.log('Step 3: Fetching deleted product variants...');
      const deletedVariants = await client.fetch<
        Array<{_id: string; title: string}>
      >(
        `*[_type == "productVariant" && store.isDeleted == true] { _id, "title": store.title }`,
      );

      console.log(`Found ${deletedVariants.length} deleted product variants`);

      if (deletedVariants.length > 0) {
        console.log('Deleting variants...');
        for (let i = 0; i < deletedVariants.length; i += BATCH_SIZE) {
          const batch = deletedVariants.slice(i, i + BATCH_SIZE);

          await Promise.allSettled(
            batch.map(async (variant) => {
              try {
                await client.delete(variant._id);
                results.push({
                  type: 'productVariant',
                  id: variant._id,
                  title: variant.title || 'Unknown',
                  success: true,
                });
                console.log(
                  `✅ Deleted variant: ${variant.title} (${variant._id})`,
                );
              } catch (error) {
                const errorMsg = `Failed to delete variant ${variant.title}: ${error}`;
                errors.push(errorMsg);
                results.push({
                  type: 'productVariant',
                  id: variant._id,
                  title: variant.title || 'Unknown',
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error',
                });
                console.error(` ${errorMsg}`);
              }
            }),
          );
        }
        console.log('Deleted variants cleanup complete');
      }

      // ============================================
      // STEP 4: Delete Product Variants (Unavailable)
      // ============================================
      console.log('Step 4: Fetching unavailable product variants...');
      const unavailableVariants = await client.fetch<
        Array<{_id: string; title: string}>
      >(
        `*[_type == "productVariant" && store.inventory.isAvailable != true] { _id, "title": store.title }`,
      );

      console.log(`Found ${unavailableVariants.length} unavailable product variants`);

      if (unavailableVariants.length > 0) {
        console.log('Deleting unavailable variants...');
        for (let i = 0; i < unavailableVariants.length; i += BATCH_SIZE) {
          const batch = unavailableVariants.slice(i, i + BATCH_SIZE);

          await Promise.allSettled(
            batch.map(async (variant) => {
              try {
                await client.delete(variant._id);
                results.push({
                  type: 'productVariant',
                  id: variant._id,
                  title: variant.title || 'Unknown',
                  success: true,
                });
                console.log(
                  `✅ Deleted unavailable variant: ${variant.title} (${variant._id})`,
                );
              } catch (error) {
                const errorMsg = `Failed to delete unavailable variant ${variant.title}: ${error}`;
                errors.push(errorMsg);
                results.push({
                  type: 'productVariant',
                  id: variant._id,
                  title: variant.title || 'Unknown',
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error',
                });
                console.error(` ${errorMsg}`);
              }
            }),
          );
        }
        console.log('Unavailable variants cleanup complete');
      }

      // ============================================
      // SUMMARY
      // ============================================
      const productsDeleted = results.filter(
        (r) => r.type === 'product' && r.success,
      ).length;
      const collectionsDeleted = results.filter(
        (r) => r.type === 'collection' && r.success,
      ).length;
      const variantsDeleted = results.filter(
        (r) => r.type === 'productVariant' && r.success,
      ).length;

      setLastRun({
        productsDeleted,
        collectionsDeleted,
        variantsDeleted,
        unavailableVariantsDeleted: unavailableVariants.length,
        errors,
      });

      console.log('\n' + '='.repeat(50));
      console.log('CLEANUP COMPLETE');
      console.log('='.repeat(50));
      console.log(`Products deleted: ${productsDeleted}`);
      console.log(`Collections deleted: ${collectionsDeleted}`);
      console.log(`Variants deleted: ${variantsDeleted}`);
      if (errors.length > 0) {
        console.log(`Errors: ${errors.length}`);
      }
      console.log('='.repeat(50));

      alert(
        `Cleanup complete!\n\n` +
          `Products deleted: ${productsDeleted}\n` +
          `Collections deleted: ${collectionsDeleted}\n` +
          `Variants deleted: ${variantsDeleted}\n` +
          (errors.length > 0 ? `\nErrors: ${errors.length}` : ''),
      );
    } catch (error) {
      console.error('Fatal error during cleanup:', error);
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
          This will permanently delete:
        </Text>
        <Box paddingLeft={3}>
          <Stack space={2}>
            <Text size={1} muted>
              • Products marked as deleted in Shopify
            </Text>
            <Text size={1} muted>
              • Collections marked as deleted in Shopify
            </Text>
            <Text size={1} muted>
              • Product variants marked as deleted in Shopify
            </Text>
            <Text size={1} muted>
              • Product variants where inventory is not available
            </Text>
          </Stack>
        </Box>

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
              <Text size={1}>
                Variants deleted: {lastRun.variantsDeleted}
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