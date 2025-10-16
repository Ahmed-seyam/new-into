import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import {colorInput} from '@sanity/color-input';
import {media} from 'sanity-plugin-media';
import {muxInput} from 'sanity-plugin-mux-input';

// Import your schema types
import schemaTypes from './schemas/schema';

// Import custom configurations
import deskStructure from './deskStructure';
import resolveInitialValueTemplates from './parts/newDocumentStructure';
import resolveDocumentActions from './parts/resolveDocumentActions';
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'

export default defineConfig({
  name: 'default',
  title: 'INTO',

  projectId: 'p4s7nr9h',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(), // Only in development, but v4 handles this automatically
    media(),
    colorInput(),
    muxInput(),
    imageHotspotArrayPlugin()
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: resolveDocumentActions,
  },

  templates: resolveInitialValueTemplates,
});
