/**
 * Backend Verification Script
 * Tests Supabase connection and checks if all required tables exist
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const [, key, value] = match;
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyBackend() {
    console.log('🔍 Verifying Backend Setup...\n');
    console.log(`📡 Supabase URL: ${supabaseUrl}\n`);

    const requiredTables = [
        'profiles',
        'missions',
        'session_game_plans',
        'training_logs',
        'weekly_reviews',
        'content_library'
    ];

    const results: { [key: string]: boolean } = {};

    for (const table of requiredTables) {
        try {
            // Try to query the table (just count, don't fetch data)
            const { error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`❌ ${table}: MISSING or NO ACCESS`);
                console.log(`   Error: ${error.message}\n`);
                results[table] = false;
            } else {
                console.log(`✅ ${table}: EXISTS (${count || 0} records)\n`);
                results[table] = true;
            }
        } catch (err) {
            console.log(`❌ ${table}: ERROR`);
            console.log(`   ${err}\n`);
            results[table] = false;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY\n');

    const existingTables = Object.entries(results).filter(([_, exists]) => exists);
    const missingTables = Object.entries(results).filter(([_, exists]) => !exists);

    console.log(`✅ Existing: ${existingTables.length}/${requiredTables.length}`);
    console.log(`❌ Missing: ${missingTables.length}/${requiredTables.length}\n`);

    if (missingTables.length > 0) {
        console.log('⚠️  NEXT STEPS:');
        console.log('1. Go to https://supabase.com/dashboard/project/prpbnkkibiwnlpglgrnt');
        console.log('2. Navigate to: SQL Editor');
        console.log('3. Copy & paste the contents of: supabase/schema.sql');
        console.log('4. Click "Run" to create the tables\n');
    } else {
        console.log('🎉 Backend is fully configured!\n');
    }

    console.log('='.repeat(50));
}

verifyBackend().catch(console.error);
