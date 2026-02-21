import { allure } from "allure-playwright";

export async function step(name: string, body: () => Promise<void>): Promise<void> {
  await allure.step(name, async () => {
    await body();
  });
}