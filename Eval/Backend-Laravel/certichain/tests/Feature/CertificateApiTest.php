<?php

namespace Tests\Feature;

use App\Models\Certificate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificateApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_empty_list_initially(): void
    {
        $response = $this->getJson('/api/certificates');

        $response->assertOk()->assertExactJson([]);
    }

    public function test_it_can_create_and_list_certificates(): void
    {
        $payload = [
            'student_name' => 'Alice',
            'title' => 'Web3 Developer',
            'issued_at' => '2026-04-01',
            'blockchain_hash' => '0xabc123',
        ];

        $this->postJson('/api/certificates', $payload)->assertStatus(201)->assertJsonFragment([
            'student_name' => 'Alice',
            'title' => 'Web3 Developer',
            'blockchain_hash' => '0xabc123',
        ]);

        $this->assertDatabaseHas('certificates', ['student_name' => 'Alice']);

        $response = $this->getJson('/api/certificates');
        $response->assertOk()->assertJsonCount(1);
    }
}
