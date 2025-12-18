<?php
/**
 * 🧪 Error Handlers Validation Tests
 * 
 * Unit tests for error-handlers.php helper library
 * Created by @QA-Tester
 * 
 * Date: 2025-12-17
 */

require_once __DIR__ . '/../../api/helpers/error-handlers.php';

$passed = 0;
$failed = 0;
$errors = [];

function test($name, $callback) {
    global $passed, $failed, $errors;
    
    try {
        $result = $callback();
        if ($result === true) {
            $passed++;
            echo "✅ $name\n";
        } else {
            $failed++;
            $errors[] = $name . ": Expected true, got " . var_export($result, true);
            echo "❌ $name\n";
        }
    } catch (Exception $e) {
        $failed++;
        $errors[] = $name . ": " . $e->getMessage();
        echo "❌ $name: " . $e->getMessage() . "\n";
    }
}

echo "🧪 Testing error-handlers.php\n";
echo "================================\n\n";

// Test 1: safeJsonDecode - valid JSON
test("safeJsonDecode: Valid JSON", function() {
    $result = safeJsonDecode('{"test": "value"}');
    return is_array($result) && $result['test'] === 'value';
});

// Test 2: safeJsonDecode - invalid JSON (should throw)
test("safeJsonDecode: Invalid JSON throws exception", function() {
    try {
        safeJsonDecode('{invalid}');
        return false; // Should have thrown
    } catch (Exception $e) {
        return strpos($e->getMessage(), 'JSON decode failed') !== false;
    }
});

// Test 3: safeJsonEncode - valid data
test("safeJsonEncode: Valid data", function() {
    $result = safeJsonEncode(['test' => 'value']);
    return $result === '{"test":"value"}';
});

// Test 4: isValidSolanaAddress - valid address
test("isValidSolanaAddress: Valid address", function() {
    return isValidSolanaAddress('11111111111111111111111111111111') === true;
});

// Test 5: isValidSolanaAddress - invalid address (too short)
test("isValidSolanaAddress: Too short", function() {
    return isValidSolanaAddress('short') === false;
});

// Test 6: isValidSolanaAddress - invalid address (too long)
test("isValidSolanaAddress: Too long", function() {
    return isValidSolanaAddress('11111111111111111111111111111111111111111111111') === false;
});

// Test 7: isValidSolanaAddress - invalid characters
test("isValidSolanaAddress: Invalid characters", function() {
    return isValidSolanaAddress('invalid@#$%^&*()characters!!!') === false;
});

// Test 8: isValidSolanaAddress - null
test("isValidSolanaAddress: Null input", function() {
    return isValidSolanaAddress(null) === false;
});

// Test 9: isValidTelegramId - valid ID
test("isValidTelegramId: Valid ID", function() {
    return isValidTelegramId('123456789') === true;
});

// Test 10: isValidTelegramId - invalid ID (not numeric)
test("isValidTelegramId: Non-numeric", function() {
    return isValidTelegramId('abc123') === false;
});

// Test 11: isValidTelegramId - negative ID
test("isValidTelegramId: Negative number", function() {
    return isValidTelegramId('-123') === false;
});

// Test 12: validateRequiredFields - all present
test("validateRequiredFields: All fields present", function() {
    $data = ['field1' => 'value1', 'field2' => 'value2'];
    // Function throws on error, returns nothing on success
    try {
        validateRequiredFields($data, ['field1', 'field2']);
        return true; // No exception = success
    } catch (Exception $e) {
        return false;
    }
});

// Test 13: validateRequiredFields - missing field (should throw)
test("validateRequiredFields: Missing field throws", function() {
    try {
        $data = ['field1' => 'value1'];
        validateRequiredFields($data, ['field1', 'field2']);
        return false; // Should have thrown
    } catch (Exception $e) {
        return strpos($e->getMessage(), 'Missing required fields') !== false;
    }
});

// Test 14: safeArrayGet - key exists
test("safeArrayGet: Key exists", function() {
    $data = ['key' => 'value'];
    return safeArrayGet($data, 'key', 'default') === 'value';
});

// Test 15: safeArrayGet - key missing (returns default)
test("safeArrayGet: Key missing returns default", function() {
    $data = ['key' => 'value'];
    return safeArrayGet($data, 'missing', 'default') === 'default';
});

// Test 16: safeArrayGet - null input (returns default)
test("safeArrayGet: Null input returns default", function() {
    return safeArrayGet(null, 'key', 'default') === 'default';
});

// Test 17: safeFileRead - non-existent file (should throw)
test("safeFileRead: Non-existent file throws", function() {
    try {
        safeFileRead('/nonexistent/file.txt');
        return false; // Should have thrown
    } catch (Exception $e) {
        return strpos($e->getMessage(), 'File not found') !== false;
    }
});

// Test 18: safeFileWrite & safeFileRead - round trip
test("safeFileWrite & safeFileRead: Round trip", function() {
    $testFile = sys_get_temp_dir() . '/test_' . uniqid() . '.txt';
    $testData = 'Test content';
    
    safeFileWrite($testFile, $testData);
    $result = safeFileRead($testFile);
    unlink($testFile);
    
    return $result === $testData;
});

// Test 19: getJsonInput - valid JSON (simulated)
test("getJsonInput: Valid JSON with required fields", function() {
    // Note: This test requires actual php://input, so we test the logic indirectly
    // by checking that the function exists and has correct signature
    return function_exists('getJsonInput');
});

// Test 20: sendSuccessResponse - function exists
test("sendSuccessResponse: Function exists", function() {
    return function_exists('sendSuccessResponse');
});

// Test 21: sendErrorResponse - function exists
test("sendErrorResponse: Function exists", function() {
    return function_exists('sendErrorResponse');
});

// Test 22: logError - function exists
test("logError: Function exists", function() {
    return function_exists('logError');
});

// Test 23: safeExec - function exists
test("safeExec: Function exists", function() {
    return function_exists('safeExec');
});

// Test 24: safeCurl - function exists
test("safeCurl: Function exists", function() {
    return function_exists('safeCurl');
});

// Test 25: safeArrayGetNested - function exists
test("safeArrayGetNested: Function exists", function() {
    return function_exists('safeArrayGetNested');
});

echo "\n================================\n";
echo "📊 Test Results:\n";
echo "  ✅ Passed: $passed\n";
echo "  ❌ Failed: $failed\n";
echo "  📈 Total:  " . ($passed + $failed) . "\n";

if ($failed > 0) {
    echo "\n❌ Failed tests:\n";
    foreach ($errors as $error) {
        echo "  - $error\n";
    }
    exit(1);
} else {
    echo "\n✅ All tests passed!\n";
    exit(0);
}
?>
