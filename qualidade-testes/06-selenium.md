# Selenium WebDriver

**Selenium 4** unifica o protocolo **W3C WebDriver**. Suporta **Python**, **Java**, **JavaScript**, **C#**, **Ruby**. É o padrão de facto em **legado** e em muitas empresas com **grids** próprios (Selenium Grid, BrowserStack, Sauce Labs).

---

## Comparar mentalmente com Playwright

- Selenium — **WebDriver** standard, ecossistema enorme, mais *boilerplate* para esperas.
- Playwright — API moderna, *auto-wait* agressivo, menos código para o mesmo fluxo.

Ainda assim, **Selenium** resta obrigatório onde a infra **já é** Grid corporativo ou políticas só aprovam drivers W3C clássicos.

---

## Python

```bash
pip install selenium webdriver-manager
```

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_title():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options,
    )
    try:
        driver.get("https://selenium.dev")
        assert "Selenium" in driver.title
        el = driver.find_element(By.CSS_SELECTOR, "h1")
        assert el.is_displayed()
    finally:
        driver.quit()
```

**Esperas explícitas** (preferir a `sleep`):

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
wait.until(EC.presence_of_element_located((By.ID, "main")))
```

---

## Node.js

```bash
npm i selenium-webdriver
# instalar browser/driver conforme doc — ou usar selenium-manager embutido no Selenium 4
```

```javascript
import { Builder, Browser, By, until } from 'selenium-webdriver';

async function run() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get('https://selenium.dev');
    await driver.wait(until.titleContains('Selenium'), 5000);
    const h1 = await driver.findElement(By.css('h1'));
    console.log(await h1.getText());
  } finally {
    await driver.quit();
  }
}
run();
```

---

## Java

Maven:

```xml
<dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-java</artifactId>
  <version>4.27.0</version>
  <scope>test</scope>
</dependency>
```

```java
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

class SeleniumDevTest {

  @Test
  void titleContainsSelenium() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    WebDriver driver = new ChromeDriver(options);
    try {
      driver.get("https://selenium.dev");
      var wait = new WebDriverWait(driver, Duration.ofSeconds(10));
      wait.until(ExpectedConditions.titleContains("Selenium"));
      var h1 = driver.findElement(By.cssSelector("h1"));
      assert h1.isDisplayed();
    } finally {
      driver.quit();
    }
  }
}
```

**Selenium Manager** (4.6+) descarrega *drivers* compatíveis automaticamente em muitos casos — reduz necessidade de `WebDriverManager` externo.

---

## Selenium Grid (visão)

Para paralelizar em várias máquinas ou browsers:

```bash
# exemplos conceituais — ver doc atual
# Hub + Nodes registados; RemoteWebDriver aponta para URL do hub
```

Útil quando E2E é grande e precisas de **escala horizontal**.

---

## Referências

- [Selenium — Documentation](https://www.selenium.dev/documentation/)
- [WebDriver — W3C](https://w3c.github.io/webdriver/)
- [Selenium Grid](https://www.selenium.dev/documentation/grid/)

---

*Sem esperas explícitas, Selenium é **fonte número um** de testes flaky; trata `WebDriverWait` como parte obrigatória do padrão.*
